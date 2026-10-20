import type { PaletteSeeds } from "../project";
import { ensureContrast, fitFill, hexToOklch, oklchToHex } from "./oklch";

/** Every colour the app derives per theme: the shadcn set plus success, warning and destructive foregrounds. */
export const COLOUR_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const;

/** The name of one derived colour, e.g. "primary-foreground". */
export type ColourToken = (typeof COLOUR_TOKENS)[number];

/** A full set of derived colours for one theme, as lowercase hex. */
export type ThemeColours = Record<ColourToken, string>;

const TEXT_MIN = 4.5;

/** Expands palette seeds into every light-theme interface colour. Overrides are applied by the caller. */
export function deriveLightTheme(seeds: PaletteSeeds): ThemeColours {
  // The grey ramp is built at the palette's own neutral hue and chroma rather than stock zinc or slate.
  const neutral = (l: number) => oklchToHex({ l, c: seeds.neutralHue.chroma, h: seeds.neutralHue.hue });
  const background = seeds.neutralLightBg.toLowerCase();
  const bgL = hexToOklch(background).l;

  const card = neutral(Math.min(bgL + 0.025, 1));
  const secondary = neutral(bgL - 0.045);
  const sidebar = neutral(bgL - 0.015);
  const border = neutral(bgL - 0.1);
  const surfaces = [background, card, secondary, sidebar];

  const foreground = ensureContrast(neutral(0.21), surfaces, TEXT_MIN);
  const mutedForeground = ensureContrast(neutral(0.5), surfaces, TEXT_MIN);
  const onFill = [foreground, neutral(0.99)];

  // The brand pair is the user's exact choice in light; the contrast checker reports it if it falls short.
  const primary = seeds.brand.toLowerCase();
  const primaryForeground = seeds.brandForeground.toLowerCase();
  const accent = fitFill(seeds.accent.toLowerCase(), onFill, TEXT_MIN);
  const destructive = fitFill(seeds.danger.toLowerCase(), onFill, TEXT_MIN);
  const success = fitFill(seeds.success.toLowerCase(), onFill, TEXT_MIN);
  const warning = fitFill(seeds.warning.toLowerCase(), onFill, TEXT_MIN);

  return {
    background,
    foreground,
    card,
    "card-foreground": foreground,
    popover: card,
    "popover-foreground": foreground,
    primary,
    "primary-foreground": primaryForeground,
    secondary,
    "secondary-foreground": foreground,
    muted: secondary,
    "muted-foreground": mutedForeground,
    accent: accent.fill,
    "accent-foreground": accent.text,
    destructive: destructive.fill,
    "destructive-foreground": destructive.text,
    success: success.fill,
    "success-foreground": success.text,
    warning: warning.fill,
    "warning-foreground": warning.text,
    border,
    input: border,
    ring: primary,
    "chart-1": primary,
    "chart-2": seeds.accent.toLowerCase(),
    "chart-3": seeds.success.toLowerCase(),
    "chart-4": seeds.warning.toLowerCase(),
    "chart-5": seeds.danger.toLowerCase(),
    sidebar,
    "sidebar-foreground": foreground,
    "sidebar-primary": primary,
    "sidebar-primary-foreground": primaryForeground,
    "sidebar-accent": secondary,
    "sidebar-accent-foreground": foreground,
    "sidebar-border": border,
    "sidebar-ring": primary,
  };
}
