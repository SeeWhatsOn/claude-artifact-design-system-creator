import type { PaletteSeeds } from "../project";
import { chartColours } from "./chart-colours";
import { BODY_TEXT_CONTRAST } from "./contrast-levels";
import { ensureContrast, fitFill, hexToOklch, oklchToHex } from "./oklch";

/** Every derived colour name: the shadcn set plus success, warning and destructive foregrounds. */
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

/** Light or dark. */
export type ThemeId = "light" | "dark";

// How each theme builds its surfaces. Light surfaces step darker from the page and dark ones lighter,
// so raised panels read as raised in both. Lightness values are OKLCH L.
const THEME_STEPS = {
  light: { card: 0.025, secondary: -0.045, sidebar: -0.015, border: -0.1, foregroundL: 0.21, mutedL: 0.5 },
  dark: { card: 0.04, secondary: 0.08, sidebar: 0.02, border: 0.14, foregroundL: 0.96, mutedL: 0.72 },
} as const;

/**
 * Expands palette seeds into every interface colour for one theme, then applies the user's overrides.
 * An overridden background feeds the derivation, so surfaces and text built on it follow.
 */
export function deriveTheme(seeds: PaletteSeeds, theme: ThemeId, overrides: Record<string, string>): ThemeColours {
  const steps = THEME_STEPS[theme];
  const isDark = theme === "dark";
  // The grey ramp is built at the palette's own neutral hue and chroma rather than stock zinc or slate.
  const neutral = (l: number) => oklchToHex({ l, c: seeds.neutralHue.chroma, h: seeds.neutralHue.hue });
  const background = overrides.background ?? (isDark ? seeds.neutralDarkBg : seeds.neutralLightBg);
  const bgL = hexToOklch(background).l;
  const step = (amount: number) => neutral(Math.min(bgL + amount, 1));

  const card = step(steps.card);
  const secondary = step(steps.secondary);
  const sidebar = step(steps.sidebar);
  const border = step(steps.border);
  const surfaces = [background, card, secondary, sidebar];

  const foreground = ensureContrast(neutral(steps.foregroundL), surfaces, BODY_TEXT_CONTRAST);
  const mutedForeground = ensureContrast(neutral(steps.mutedL), surfaces, BODY_TEXT_CONTRAST);
  const onFill = [foreground, isDark ? background : neutral(0.99)];

  // In light, the brand pair is the user's exact choice; the contrast checker reports it if it falls short.
  // Brands are tuned for light surfaces, so dark mode lightens the brand until it reads on the dark
  // background, then puts dark text on it.
  const primary = isDark ? ensureContrast(seeds.brand, [background, card], BODY_TEXT_CONTRAST) : seeds.brand;
  const primaryForeground = isDark ? background : seeds.brandForeground;

  const accent = fitFill(seeds.accent, onFill, BODY_TEXT_CONTRAST);
  const destructive = fitFill(seeds.danger, onFill, BODY_TEXT_CONTRAST);
  const success = fitFill(seeds.success, onFill, BODY_TEXT_CONTRAST);
  const warning = fitFill(seeds.warning, onFill, BODY_TEXT_CONTRAST);
  // Chart series keep the seeds' hues but are spaced by lightness, so they can be told apart.
  const [chart1, chart2, chart3, chart4, chart5] = chartColours(
    [seeds.brand, seeds.accent, seeds.success, seeds.warning, seeds.danger],
    background,
  );

  const derived: ThemeColours = {
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
    "chart-1": chart1 ?? primary,
    "chart-2": chart2 ?? primary,
    "chart-3": chart3 ?? primary,
    "chart-4": chart4 ?? primary,
    "chart-5": chart5 ?? primary,
    sidebar,
    "sidebar-foreground": foreground,
    "sidebar-primary": primary,
    "sidebar-primary-foreground": primaryForeground,
    "sidebar-accent": secondary,
    "sidebar-accent-foreground": foreground,
    "sidebar-border": border,
    "sidebar-ring": primary,
  };
  // Overrides win last; unknown names (from an older or hand-edited file) are ignored.
  for (const name of COLOUR_TOKENS) derived[name] = overrides[name] ?? derived[name];
  return derived;
}
