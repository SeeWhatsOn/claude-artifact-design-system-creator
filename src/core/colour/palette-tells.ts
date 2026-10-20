import type { Diagnostic } from "../compile";
import type { PaletteSeeds } from "../project";
import { hexToOklch, type Oklch } from "./oklch";

// The palettes AI output converges on (docs/research/02), described as OKLCH ranges so near misses match too.
// Calibrated so that, of the curated palettes, only Hi-Vis (a deliberate echo) trips one.
const TELLS: { id: string; message: string; matches: (seeds: PaletteSeeds) => boolean }[] = [
  {
    id: "purple-indigo",
    message:
      "Your main or highlight colour is purple-indigo, the most common AI-generated look. Keep it only if it really is your brand colour.",
    matches: seeds => [seeds.brand, seeds.accent].some(hex => isPurpleIndigo(hexToOklch(hex))),
  },
  {
    id: "cream-terracotta",
    message:
      "A cream background with a terracotta colour looks like Claude's own default style. Keep it only if it really is your brand.",
    matches: seeds =>
      isCream(hexToOklch(seeds.neutralLightBg)) &&
      [seeds.brand, seeds.accent].some(hex => isTerracotta(hexToOklch(hex))),
  },
  {
    id: "black-acid",
    message:
      "A near-black main colour with one bright acid highlight is a stock 'tech' look. Keep it only if it really is your brand.",
    matches: seeds =>
      (isNearBlack(hexToOklch(seeds.brand)) || hexToOklch(seeds.neutralLightBg).l <= 0.25) &&
      isAcid(hexToOklch(seeds.accent)),
  },
];

/** Warns when a palette's seeds resemble a known generic look. */
export function checkPaletteTells(seeds: PaletteSeeds): Diagnostic[] {
  return TELLS.filter(tell => tell.matches(seeds)).map(tell => ({
    severity: "warn",
    code: `palette-tell-${tell.id}`,
    message: tell.message,
    step: "colour",
    path: "palette.seeds",
  }));
}

function isPurpleIndigo({ c, h }: Oklch): boolean {
  return c >= 0.12 && h >= 265 && h <= 315;
}

function isCream({ l, c, h }: Oklch): boolean {
  return l >= 0.93 && c >= 0.006 && c <= 0.045 && h >= 50 && h <= 105;
}

function isTerracotta({ l, c, h }: Oklch): boolean {
  return c >= 0.09 && l >= 0.5 && l <= 0.78 && h >= 28 && h <= 52;
}

function isNearBlack({ l, c }: Oklch): boolean {
  return l <= 0.32 && c <= 0.03;
}

// Acid green-yellow or vermilion, bright and saturated.
function isAcid({ l, c, h }: Oklch): boolean {
  return c >= 0.15 && l >= 0.62 && ((h >= 85 && h <= 150) || (h >= 25 && h <= 45));
}
