import { test, expect, describe } from "bun:test";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";
import { applyPalette, PALETTES } from "./palettes";
import { clearOverride, randomisePalette, SEED_GROUPS, setOverride, setSeed, type SeedGroup } from "./palette-editing";
import type { Project } from "./project";

// A small seeded generator so randomise tests are repeatable.
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function blocks(project: Project) {
  return compile(project).diagnostics.filter(diagnostic => diagnostic.severity === "block");
}

function codes(project: Project) {
  return compile(project).diagnostics.map(diagnostic => diagnostic.code);
}

describe("editing a seed", () => {
  test("changes the preview and leaves the curated palette behind", () => {
    const before = compile(createDefaultProject()).preview.light["--chart-2"];
    const project = setSeed(createDefaultProject(), "accent", "#2A9D8F");
    expect(project.palette.seeds.accent).toBe("#2a9d8f");
    expect(project.palette.paletteId).toBeNull();
    expect(compile(project).preview.light["--chart-2"]).not.toBe(before);
  });

  test("the grey tint feeds every derived surface", () => {
    const before = compile(createDefaultProject()).preview.light["--card"];
    const project = setSeed(createDefaultProject(), "neutralHue", { hue: 250, chroma: 0.03 });
    expect(compile(project).preview.light["--card"]).not.toBe(before);
  });
});

describe("randomise", () => {
  test("changes every unlocked seed group and keeps the locked ones", () => {
    const start = createDefaultProject();
    const result = randomisePalette(start, new Set<SeedGroup>(["brand", "danger"]), seededRandom(1));
    if (!result.ok) throw new Error(result.reason);
    const { seeds } = result.project.palette;
    expect(seeds.brand).toBe(start.palette.seeds.brand);
    expect(seeds.brandForeground).toBe(start.palette.seeds.brandForeground);
    expect(seeds.danger).toBe(start.palette.seeds.danger);
    expect(seeds.accent).not.toBe(start.palette.seeds.accent);
    expect(seeds.neutralLightBg).not.toBe(start.palette.seeds.neutralLightBg);
    expect(result.project.palette.paletteId).toBeNull();
  });

  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])("randomised colours pass the contrast gates (seed %i)", seed => {
    const result = randomisePalette(createDefaultProject(), new Set(), seededRandom(seed));
    if (!result.ok) throw new Error(result.reason);
    expect(blocks(result.project)).toEqual([]);
  });

  test("with everything locked, nothing changes", () => {
    const start = createDefaultProject();
    const result = randomisePalette(start, new Set(SEED_GROUPS), seededRandom(3));
    expect(result.ok && result.project.palette.seeds).toEqual(start.palette.seeds);
  });

  test("explains why when the locked colours can't pass the checks", () => {
    // Text on the main colour is nearly the same blue as the colour itself, and both are locked.
    const start = setSeed(createDefaultProject(), "brandForeground", "#2a7cc4");
    const result = randomisePalette(start, new Set<SeedGroup>(["brand"]), seededRandom(4));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain("Text on the main button colour");
  });
});

describe("advanced overrides", () => {
  const overridden = setOverride(createDefaultProject(), "light", "card", "#ABCDEF");

  test("apply last, over the derived colour", () => {
    expect(compile(overridden).preview.light["--card"]).toBe("#abcdef");
  });

  test("survive swapping to another palette", () => {
    expect(compile(applyPalette(overridden, "ledger-ink")).preview.light["--card"]).toBe("#abcdef");
  });

  test("survive editing a seed and randomising", () => {
    expect(compile(setSeed(overridden, "brand", "#be1e2d")).preview.light["--card"]).toBe("#abcdef");
    const result = randomisePalette(overridden, new Set(), seededRandom(5));
    expect(result.ok && compile(result.project).preview.light["--card"]).toBe("#abcdef");
  });

  test("can be cleared to go back to the derived colour", () => {
    const cleared = clearOverride(overridden, "light", "card");
    expect(cleared.palette.overrides.light).toEqual({});
    expect(compile(cleared).preview.light["--card"]).toBe(compile(createDefaultProject()).preview.light["--card"]);
  });
});

describe("generic-look warnings", () => {
  test("a purple-indigo main colour warns", () => {
    const project = setSeed(createDefaultProject(), "brand", "#6366f1");
    const tell = compile(project).diagnostics.find(diagnostic => diagnostic.code === "palette-tell-purple-indigo");
    expect(tell).toMatchObject({ severity: "warn", step: "colour" });
  });

  test("cream with terracotta warns", () => {
    const project = setSeed(setSeed(createDefaultProject(), "neutralLightBg", "#f4f1ea"), "accent", "#d97757");
    expect(codes(project)).toContain("palette-tell-cream-terracotta");
  });

  test("a near-black main colour with an acid accent warns", () => {
    const project = setSeed(setSeed(createDefaultProject(), "brand", "#111111"), "accent", "#c6ff00");
    expect(codes(project)).toContain("palette-tell-black-acid");
  });

  test("among the curated palettes, only Hi-Vis echoes a tell, as its notes say", () => {
    const echoing = PALETTES.filter(palette =>
      codes(applyPalette(createDefaultProject(), palette.id)).some(code => code.startsWith("palette-tell-")),
    ).map(palette => palette.id);
    expect(echoing).toEqual(["hi-vis"]);
  });
});
