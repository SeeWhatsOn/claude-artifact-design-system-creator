import type { PaletteSeeds } from "../project";
import { ensureContrast, fitFill, hexToOklch, oklchToHex } from "./oklch";

// Every colour the app derives per theme: the shadcn set plus success, warning and destructive foregrounds.
const COLOUR_TOKENS = [
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

const TEXT_MIN = 4.5;
// Chart marks aren't text, so they need the 3:1 non-text contrast against the background.
const GRAPHIC_MIN = 3;

/** Expands palette seeds into every interface colour for one theme. Overrides are applied by the caller. */
export function deriveTheme(seeds: PaletteSeeds, theme: ThemeId): ThemeColours {
  // The grey ramp is built at the palette's own neutral hue and chroma rather than stock zinc or slate.
  const neutral = (l: number) => oklchToHex({ l, c: seeds.neutralHue.chroma, h: seeds.neutralHue.hue });
  const isDark = theme === "dark";
  const background = (isDark ? seeds.neutralDarkBg : seeds.neutralLightBg).toLowerCase();
  const bgL = hexToOklch(background).l;
  // Light surfaces step darker from the page; dark surfaces step lighter, so raised panels read as raised.
  const step = (amount: number) => neutral(isDark ? bgL + amount : bgL - amount);

  const card = isDark ? step(0.04) : neutral(Math.min(bgL + 0.025, 1));
  const secondary = step(isDark ? 0.08 : 0.045);
  const sidebar = step(isDark ? 0.02 : 0.015);
  const border = step(isDark ? 0.14 : 0.1);
  const surfaces = [background, card, secondary, sidebar];

  const foreground = ensureContrast(neutral(isDark ? 0.96 : 0.21), surfaces, TEXT_MIN);
  const mutedForeground = ensureContrast(neutral(isDark ? 0.72 : 0.5), surfaces, TEXT_MIN);
  const onFill = [foreground, isDark ? background : neutral(0.99)];

  // In light, the brand pair is the user's exact choice; the contrast checker reports it if it falls short.
  // Brands are tuned for light surfaces, so dark mode lightens the brand until it reads on the dark
  // background, then puts dark text on it.
  const primary = isDark
    ? ensureContrast(seeds.brand.toLowerCase(), [background, card], TEXT_MIN)
    : seeds.brand.toLowerCase();
  const primaryForeground = isDark ? background : seeds.brandForeground.toLowerCase();

  const accent = fitFill(seeds.accent.toLowerCase(), onFill, TEXT_MIN);
  const destructive = fitFill(seeds.danger.toLowerCase(), onFill, TEXT_MIN);
  const success = fitFill(seeds.success.toLowerCase(), onFill, TEXT_MIN);
  const warning = fitFill(seeds.warning.toLowerCase(), onFill, TEXT_MIN);
  const chart = (seed: string) => ensureContrast(seed.toLowerCase(), [background], isDark ? GRAPHIC_MIN : 1);

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
    "chart-2": chart(seeds.accent),
    "chart-3": chart(seeds.success),
    "chart-4": chart(seeds.warning),
    "chart-5": chart(seeds.danger),
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
