import { checkContrast } from "./colour/contrast-check";
import { deriveTheme, type ColourToken, type ThemeId } from "./colour/derive-theme";
import { contrast, oklchToHex } from "./colour/oklch";
import { checkPaletteTells } from "./colour/palette-tells";
import type { Diagnostic } from "./compile";
import type { PaletteSeeds, Project } from "./project";

/** The seeds randomise treats as one unit, each with its own lock. */
export const SEED_GROUPS = ["brand", "neutral", "accent", "success", "warning", "danger"] as const;

/** One lockable group of seeds. */
export type SeedGroup = (typeof SEED_GROUPS)[number];

/** The outcome of randomising: new colours, or why none could be found. */
export type RandomiseResult = { ok: true; project: Project } | { ok: false; reason: string };

// Enough tries to find a clean palette almost every time, few enough to stay instant.
const ATTEMPTS = 60;

/** Sets one seed. The palette no longer matches a curated one, so its id is cleared. */
export function setSeed<K extends keyof PaletteSeeds>(project: Project, key: K, value: PaletteSeeds[K]): Project {
  const stored = typeof value === "string" ? value.toLowerCase() : value;
  return {
    ...project,
    palette: { ...project.palette, paletteId: null, seeds: { ...project.palette.seeds, [key]: stored } },
  };
}

/** Pins one derived colour in one theme. Overrides apply after derivation, so they outlive seed changes. */
export function setOverride(project: Project, theme: ThemeId, token: ColourToken, hex: string): Project {
  const overrides = {
    ...project.palette.overrides,
    [theme]: { ...project.palette.overrides[theme], [token]: hex.toLowerCase() },
  };
  return { ...project, palette: { ...project.palette, overrides } };
}

/** Removes one override, so the colour is derived from the seeds again. */
export function clearOverride(project: Project, theme: ThemeId, token: ColourToken): Project {
  const { [token]: _removed, ...rest } = project.palette.overrides[theme];
  return { ...project, palette: { ...project.palette, overrides: { ...project.palette.overrides, [theme]: rest } } };
}

/**
 * Replaces every unlocked seed group with a random colour in a sensible range. Keeps trying until the
 * themes pass the contrast checks, preferring a palette with no warnings and no generic-look echo.
 */
export function randomisePalette(
  project: Project,
  locks: ReadonlySet<SeedGroup>,
  random: () => number = Math.random,
): RandomiseResult {
  if (SEED_GROUPS.every(group => locks.has(group))) return { ok: true, project };
  let usable: Project | undefined;
  let lastBlock: Diagnostic | undefined;
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const seeds = randomSeeds(project.palette.seeds, locks, random);
    const candidate = { ...project, palette: { ...project.palette, paletteId: null, seeds } };
    const diagnostics = paletteDiagnostics(candidate);
    const block = diagnostics.find(diagnostic => diagnostic.severity === "block");
    if (!block && diagnostics.length === 0) return { ok: true, project: candidate };
    if (!block) usable ??= candidate;
    lastBlock = block ?? lastBlock;
  }
  if (usable) return { ok: true, project: usable };
  return {
    ok: false,
    reason:
      `No colours pass the checks with your locked colours. ${lastBlock?.message ?? ""} Unlock or change that colour.`.trim(),
  };
}

function paletteDiagnostics(project: Project): Diagnostic[] {
  const themes: ThemeId[] = project.darkEnabled ? ["light", "dark"] : ["light"];
  const contrastChecks = themes.flatMap(theme =>
    checkContrast(deriveTheme(project.palette.seeds, theme, project.palette.overrides[theme]), theme),
  );
  return [...contrastChecks, ...checkPaletteTells(project.palette.seeds)];
}

function randomSeeds(current: PaletteSeeds, locks: ReadonlySet<SeedGroup>, random: () => number): PaletteSeeds {
  const between = (low: number, high: number) => low + random() * (high - low);
  const seeds = { ...current };
  if (!locks.has("brand")) {
    seeds.brand = oklchToHex({ l: between(0.4, 0.55), c: between(0.09, 0.19), h: between(0, 360) });
    // White or near-black, whichever reads better on the new brand colour.
    const dark = "#1a1a1a";
    seeds.brandForeground = contrast("#ffffff", seeds.brand) >= contrast(dark, seeds.brand) ? "#ffffff" : dark;
  }
  if (!locks.has("neutral")) {
    const hue = between(0, 360);
    const chroma = between(0, 0.02);
    seeds.neutralHue = { hue: Math.round(hue), chroma: Math.round(chroma * 1000) / 1000 };
    seeds.neutralLightBg = oklchToHex({ l: between(0.955, 0.985), c: chroma, h: hue });
    seeds.neutralDarkBg = oklchToHex({ l: between(0.17, 0.23), c: chroma, h: hue });
  }
  // Status colours stay in their expected hue families so green still means success.
  if (!locks.has("accent"))
    seeds.accent = oklchToHex({ l: between(0.62, 0.85), c: between(0.1, 0.18), h: between(0, 360) });
  if (!locks.has("success"))
    seeds.success = oklchToHex({ l: between(0.45, 0.6), c: between(0.1, 0.16), h: between(135, 160) });
  if (!locks.has("warning"))
    seeds.warning = oklchToHex({ l: between(0.68, 0.8), c: between(0.12, 0.17), h: between(55, 85) });
  if (!locks.has("danger"))
    seeds.danger = oklchToHex({ l: between(0.5, 0.6), c: between(0.15, 0.2), h: between(20, 35) });
  return seeds;
}
