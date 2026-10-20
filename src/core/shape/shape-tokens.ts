import { hexToRgba } from "../colour/oklch";
import type { Shape } from "../project";

/** One exported length or shadow, in the Design System's list shape. */
export type ShapeToken = { name: string; value: string; usage: string };

// Multiples of the base per density. Six steps: a small, legible scale rather than every value.
const DENSITY_STEPS = {
  compact: [1, 2, 3, 4, 6, 8],
  comfortable: [1, 2, 4, 6, 8, 12],
  airy: [2, 4, 6, 8, 12, 16],
} as const;

const SPACING_USAGE = [
  "Gap between an icon and its label, or between tightly related items.",
  "Gaps inside controls and between items in a list or button group.",
  "Padding inside controls and compact cards.",
  "Card padding and gaps between cards.",
  "Gaps between groups of content within a section.",
  "Space between major page sections.",
];

const RADIUS_USAGE: Record<keyof NonNullable<Shape["radii"]>, string> = {
  control: "Buttons, inputs, selects and other controls.",
  card: "Cards, panels and table containers.",
  dialog: "Dialogs, popovers, menus and sheets.",
  pill: "Badges, tags and pill toggles only.",
};

/** The spacing scale: six steps, each a multiple of the base grid, spread wider as density gets airier. */
export function spacingTokens(shape: Shape): ShapeToken[] {
  return DENSITY_STEPS[shape.density].map((multiple, index) => ({
    name: `space-${index + 1}`,
    value: `${multiple * shape.spacingBase}px`,
    usage: SPACING_USAGE[index] ?? "",
  }));
}

/** The four radii by hierarchy, or none when the user hasn't chosen them yet. */
export function radiusTokens(shape: Shape): ShapeToken[] {
  if (!shape.radii) return [];
  const radii = shape.radii;
  return (Object.keys(RADIUS_USAGE) as (keyof typeof RADIUS_USAGE)[]).map(key => ({
    name: `radius-${key}`,
    value: `${radii[key]}px`,
    usage: RADIUS_USAGE[key],
  }));
}

/**
 * The built shadow for raised surfaces and a deeper one (double offset and blur) for overlays.
 * A flat brand gets one explicit "none" token, so Claude doesn't fall back to its own soft shadow.
 */
export function shadowTokens(shape: Shape): ShapeToken[] {
  const { enabled, colour, opacity, x, y, blur, spread } = shape.shadow;
  if (!enabled) {
    return [
      {
        name: "shadow-none",
        value: "none",
        usage: "This brand is flat: never add shadows. Separate surfaces with borders, fills and space.",
      },
    ];
  }
  // rgb() with alpha is one of the colour syntaxes the Design System accepts.
  const rgba = hexToRgba(colour, opacity);
  return [
    {
      name: "shadow-raised",
      value: `${x}px ${y}px ${blur}px ${spread}px ${rgba}`,
      usage: "Cards and raised panels that sit on the page.",
    },
    {
      name: "shadow-overlay",
      value: `${x * 2}px ${y * 2}px ${blur * 2}px ${spread}px ${rgba}`,
      usage: "Dialogs, popovers and menus that float above everything else.",
    },
  ];
}
