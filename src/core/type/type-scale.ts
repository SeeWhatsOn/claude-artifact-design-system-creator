import type { FamilySlot, FontRef, Project, TextRole } from "../project";

/** The named ratios the picker offers, from quiet to loud. Each step up multiplies size by the ratio. */
export const TYPE_RATIOS = [
  { name: "Gentle", ratio: 1.125 },
  { name: "Calm", ratio: 1.2 },
  { name: "Balanced", ratio: 1.25 },
  { name: "Classic", ratio: 1.333 },
  { name: "Bold", ratio: 1.414 },
  { name: "Dramatic", ratio: 1.5 },
] as const;

/** One role's finished style, in px except letter spacing (em) and line height (px). */
export type TypeStyle = {
  family: FamilySlot;
  size: number;
  lineHeight: number;
  weight: number;
  letterSpacing: number;
  case: "none" | "upper" | "lower" | "title";
  usage: string;
};

// Where each role sits on the scale (base × ratio^step) and what it looks like before overrides.
// Big text gets tight leading and slight negative tracking; labels stay in sentence case on purpose,
// because ALL-CAPS tracked eyebrows are a generic tell.
const ROLE_DEFAULTS: Record<TextRole, Omit<TypeStyle, "size" | "case"> & { step: number }> = {
  display: {
    family: "display",
    step: 4,
    weight: 700,
    lineHeight: 1.1,
    letterSpacing: -0.02,
    usage: "The one biggest line on a cover, hero or slide title. At most one per view.",
  },
  h1: { family: "display", step: 3, weight: 700, lineHeight: 1.15, letterSpacing: -0.015, usage: "Page titles." },
  h2: { family: "display", step: 2, weight: 600, lineHeight: 1.2, letterSpacing: -0.01, usage: "Section headings." },
  h3: {
    family: "display",
    step: 1,
    weight: 600,
    lineHeight: 1.3,
    letterSpacing: 0,
    usage: "Sub-section and card headings.",
  },
  lead: {
    family: "body",
    step: 0.5,
    weight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    usage: "The opening paragraph under a page title.",
  },
  body: {
    family: "body",
    step: 0,
    weight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    usage: "Paragraphs, table cells and form values.",
  },
  small: {
    family: "body",
    step: -0.5,
    weight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    usage: "Help text, metadata and dense tables.",
  },
  caption: {
    family: "body",
    step: -1,
    weight: 400,
    lineHeight: 1.4,
    letterSpacing: 0,
    usage: "Image and chart captions, footnotes.",
  },
  label: {
    family: "body",
    step: -0.5,
    weight: 500,
    lineHeight: 1.3,
    letterSpacing: 0,
    usage: "Form labels, buttons, tabs and badges.",
  },
  code: {
    family: "mono",
    step: -0.5,
    weight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    usage: "Inline code and code blocks.",
  },
};

/** Builds all ten text roles from the base size and ratio, then applies the user's per-role overrides. */
export function typeStyles(type: Project["type"]): Record<TextRole, TypeStyle> {
  const entries = Object.entries(ROLE_DEFAULTS).map(([role, defaults]) => {
    const override = type.roleOverrides[role as TextRole] ?? {};
    const family = override.family ?? defaults.family;
    const size = override.size ?? Math.round(type.base * type.ratio ** defaults.step);
    const lineHeight = Math.round(size * (override.lineHeight ?? defaults.lineHeight));
    const style: TypeStyle = {
      family,
      size,
      lineHeight,
      // Snapped so a font is never asked for a weight it doesn't ship, whatever was requested.
      weight: nearestWeight(type.families[family].weights, override.weight ?? defaults.weight),
      letterSpacing: override.letterSpacing ?? defaults.letterSpacing,
      case: override.case ?? "none",
      usage: defaults.usage,
    };
    return [role, style];
  });
  return Object.fromEntries(entries) as Record<TextRole, TypeStyle>;
}

/** The weight a font actually ships that is closest to the one asked for. Ties go to the lighter weight. */
export function nearestWeight(available: readonly number[], wanted: number): number {
  return available.reduce((best, weight) => (Math.abs(weight - wanted) < Math.abs(best - wanted) ? weight : best));
}

/** A CSS font-family stack: the family, then a generic fallback from its category (or its slot when unknown). */
export function fontStack(font: FontRef, slot: FamilySlot): string {
  const generic =
    font.category === "serif" || font.category === "monospace" || font.category === "sans-serif"
      ? font.category
      : slot === "mono"
        ? "monospace"
        : "sans-serif";
  return `"${font.family}", ${generic}`;
}
