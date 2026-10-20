import type { Diagnostic } from "../compile";
import type { ColourToken, ThemeColours, ThemeId } from "./derive-theme";
import { BODY_TEXT_CONTRAST, formatRatio, MIN_TEXT_CONTRAST } from "./contrast-levels";
import { contrast } from "./oklch";

// Every text-on-surface pair the components use. All of it is body-size text (buttons and badges
// are 14px), so every pair is held to the body-text bar.
const TEXT_PAIRS: { text: ColourToken; surface: ColourToken; label: string }[] = [
  { text: "foreground", surface: "background", label: "Body text on the page background" },
  { text: "card-foreground", surface: "card", label: "Text on cards" },
  { text: "secondary-foreground", surface: "secondary", label: "Text on secondary buttons" },
  { text: "muted-foreground", surface: "background", label: "Quiet text on the page background" },
  { text: "muted-foreground", surface: "card", label: "Quiet text on cards" },
  { text: "muted-foreground", surface: "muted", label: "Quiet text on muted fills" },
  { text: "primary-foreground", surface: "primary", label: "Text on the main button colour" },
  { text: "primary", surface: "background", label: "Links on the page background" },
  { text: "accent-foreground", surface: "accent", label: "Text on the accent colour" },
  { text: "destructive-foreground", surface: "destructive", label: "Text on the danger colour" },
  { text: "success-foreground", surface: "success", label: "Text on the success colour" },
  { text: "warning-foreground", surface: "warning", label: "Text on the warning colour" },
  { text: "sidebar-foreground", surface: "sidebar", label: "Text in the sidebar" },
  { text: "sidebar-primary-foreground", surface: "sidebar-primary", label: "Text on the sidebar's main colour" },
];

/** WCAG-checks every text/surface pair in one theme: too faint blocks export, hard to read warns. */
export function checkContrast(colours: ThemeColours, theme: ThemeId): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  // Several pairs share colours (the sidebar reuses the main button's), so each colour pair is reported once.
  const checked = new Set<string>();
  for (const { text, surface, label } of TEXT_PAIRS) {
    const key = `${colours[text]}/${colours[surface]}`;
    if (checked.has(key)) continue;
    checked.add(key);
    const ratio = contrast(colours[text], colours[surface]);
    if (ratio >= BODY_TEXT_CONTRAST) continue;
    const shown = formatRatio(ratio);
    const blocked = ratio < MIN_TEXT_CONTRAST;
    diagnostics.push({
      severity: blocked ? "block" : "warn",
      code: blocked ? "contrast-too-low" : "contrast-low",
      message: blocked
        ? `${label} is too faint to read in the ${theme} theme (${shown}). It needs at least ${formatRatio(MIN_TEXT_CONTRAST)}, and ${formatRatio(BODY_TEXT_CONTRAST)} to be easy to read.`
        : `${label} is hard to read in the ${theme} theme (${shown}). Aim for ${formatRatio(BODY_TEXT_CONTRAST)}.`,
      step: "colour",
      path: `colours.${theme}.${text}`,
    });
  }
  return diagnostics;
}
