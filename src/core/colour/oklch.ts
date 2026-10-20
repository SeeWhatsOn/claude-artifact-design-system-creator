import { clampChroma, converter, formatHex, wcagContrast } from "culori";

const toOklch = converter("oklch");

/** A colour as OKLCH lightness (0–1), chroma and hue (degrees). */
export type Oklch = { l: number; c: number; h: number };

/** Reads a hex colour as OKLCH. Throws on input that isn't a colour, which the project schema already rules out. */
export function hexToOklch(hex: string): Oklch {
  const colour = toOklch(hex);
  if (!colour) throw new Error(`Not a colour: ${hex}`);
  return { l: colour.l, c: colour.c, h: colour.h ?? 0 };
}

/** Turns OKLCH into a lowercase sRGB hex, reducing chroma (not lightness) to stay inside the sRGB gamut. */
export function oklchToHex({ l, c, h }: Oklch): string {
  const inGamut = clampChroma({ mode: "oklch", l: clamp(l, 0, 1), c, h }, "oklch");
  return formatHex(inGamut) ?? "#000000";
}

/** WCAG 2 contrast ratio between two colours (1–21). Wrapped so only this file depends on culori. */
export function contrast(a: string, b: string): number {
  return wcagContrast(a, b);
}

/**
 * Moves a text colour's lightness away from its backgrounds until it reaches `min` against all of them.
 * Light backgrounds push it darker, dark ones lighter. Returns the input unchanged if it already passes.
 */
export function ensureContrast(fg: string, backgrounds: readonly string[], min: number): string {
  const passes = (colour: string) => backgrounds.every(bg => contrast(colour, bg) >= min);
  if (passes(fg)) return fg;
  const darken = backgrounds.reduce((sum, bg) => sum + hexToOklch(bg).l, 0) / backgrounds.length > 0.5;
  const start = hexToOklch(fg);
  let candidate = fg;
  // 0.005 steps are fine enough to stop close to the threshold rather than overshooting to black or white.
  for (let l = start.l; l >= 0 && l <= 1; l += darken ? -0.005 : 0.005) {
    candidate = oklchToHex({ ...start, l });
    if (passes(candidate)) return candidate;
  }
  return candidate;
}

/**
 * For a filled surface (a button, a badge), picks whichever candidate text colour reads best on it.
 * If even that falls short of `min`, the fill's lightness moves away from the text until it passes.
 */
export function fitFill(fill: string, textCandidates: readonly string[], min: number): { fill: string; text: string } {
  const text = textCandidates.reduce((best, candidate) =>
    contrast(candidate, fill) > contrast(best, fill) ? candidate : best,
  );
  return { fill: ensureContrast(fill, [text], min), text };
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}
