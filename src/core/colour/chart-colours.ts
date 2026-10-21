import type { Diagnostic } from "../compile";
import type { ThemeColours, ThemeId } from "./derive-theme";
import { NON_TEXT_CONTRAST } from "./contrast-levels";
import { ensureContrast, hexToOklch, oklchToHex } from "./oklch";

/** Chart series must differ by at least this much OKLCH lightness, so they stay apart in greyscale and for colour-blind readers. */
export const MIN_CHART_LIGHTNESS_GAP = 0.08;

const SERIES = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] as const;
// Steps sit 0.09 apart: a little over the minimum gap, so gamut clamping can't push two together.
const STEP = 0.09;
// Keeps the band a hair inside the 3:1 limit so rounding to hex can't drop a series below it.
const MARGIN = 0.02;

/**
 * Builds five chart colours from the palette: each keeps its seed's hue and chroma, but lightness comes from
 * evenly spaced steps that all read at 3:1 on the page. Each seed takes the free step nearest its own lightness,
 * so the brand stays close to itself.
 */
export function chartColours(seeds: readonly string[], background: string): string[] {
  const steps = lightnessSteps(background);
  const free = [...steps];
  return seeds.map(seed => {
    const colour = hexToOklch(seed);
    const index = free.reduce(
      (best, l, i) => (Math.abs(l - colour.l) < Math.abs((free[best] ?? 0) - colour.l) ? i : best),
      0,
    );
    const [l = steps[0] ?? 0.5] = free.splice(index, 1);
    // Chroma changes luminance a little, so the contrast is confirmed after picking the step.
    return ensureContrast(oklchToHex({ ...colour, l }), [background], NON_TEXT_CONTRAST);
  });
}

// Light pages get the band just darker than the 3:1 limit; dark pages get it just lighter.
function lightnessSteps(background: string): number[] {
  const bgL = hexToOklch(background).l;
  const darken = bgL > 0.5;
  const limit = hexToOklch(ensureContrast(oklchToHex({ l: bgL, c: 0, h: 0 }), [background], NON_TEXT_CONTRAST)).l;
  const span = STEP * (SERIES.length - 1);
  const start = darken ? Math.max(limit - MARGIN - span, 0.05) : Math.min(limit + MARGIN, 0.97 - span);
  return SERIES.map((_, i) => start + i * STEP);
}

/** Warns when two chart series (for example after overrides) are too close in lightness to tell apart. */
export function checkChartColours(colours: ThemeColours, theme: ThemeId): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  SERIES.forEach((name, j) => {
    const clash = SERIES.slice(0, j).find(
      other => Math.abs(hexToOklch(colours[other]).l - hexToOklch(colours[name]).l) < MIN_CHART_LIGHTNESS_GAP,
    );
    if (!clash) return;
    diagnostics.push({
      severity: "warn",
      code: "chart-lightness",
      message: `Chart colours ${clash.slice(6)} and ${name.slice(6)} are too close in lightness to tell apart in the ${theme} theme. Make one lighter or darker.`,
      step: "colour",
      path: `colours.${theme}.${name}`,
    });
  });
  return diagnostics;
}
