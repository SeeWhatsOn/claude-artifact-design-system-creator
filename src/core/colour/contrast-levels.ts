// WCAG 2 contrast levels, in one place so the colour engine, the checks and the export agree.

/** Body text must reach this to be easy to read (WCAG AA). Below it, the checks warn. */
export const BODY_TEXT_CONTRAST = 4.5;

/** Text below this is too faint to read at any size, so export is blocked. */
export const MIN_TEXT_CONTRAST = 3;

/** Non-text marks such as chart lines and focus rings need this against their background. */
export const NON_TEXT_CONTRAST = 3;

/** Formats a ratio the way people read it, e.g. "4.5:1". */
export function formatRatio(ratio: number): string {
  return `${Math.floor(ratio * 10) / 10}:1`;
}
