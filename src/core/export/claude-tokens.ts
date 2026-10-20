import type { ColourToken } from "../colour/derive-theme";
import { textTransform } from "../preview-vars";
import { FAMILY_SLOTS, TEXT_ROLES, type FamilySlot, type Project } from "../project";
import { radiusTokens, shadowTokens, spacingTokens } from "../shape/shape-tokens";
import { fontStack, typeStyles, type TypeStyle } from "../type/type-scale";
import type { BundledFont } from "../type/uploaded-fonts";
import type { ExportTheme } from "./claude-design-system";

// The small, legible set Claude gets: core surfaces and text, actions, status and chart colours.
// Popover, input and the sidebar set are shadcn plumbing and stay out of the Design System.
/** The exported colours and what each is for. */
export const COLOUR_USAGE: [ColourToken, string][] = [
  ["background", "Page background."],
  ["foreground", "Body text and headings on background, card and secondary."],
  ["card", "Cards and raised panels on the page background."],
  ["card-foreground", "Text on card."],
  ["primary", "The one main action per view: primary buttons, links, selected states."],
  ["primary-foreground", "Text and icons on primary."],
  ["secondary", "Secondary buttons, quiet panels and table header rows."],
  ["secondary-foreground", "Text on secondary."],
  ["muted", "Subtle fills: disabled controls, skeletons, code blocks."],
  ["muted-foreground", "Secondary text: captions, help text, timestamps. Readable on background, card and muted."],
  ["accent", "Highlights and hover fills for menu items and ghost buttons. Never for large areas."],
  ["accent-foreground", "Text on accent."],
  ["border", "Hairline borders and dividers between surfaces; also input borders."],
  ["ring", "Focus outlines on interactive elements."],
  ["destructive", "Delete and other irreversible actions, and error states. Always pair with an icon or words."],
  ["destructive-foreground", "Text and icons on destructive."],
  ["success", "Positive status: saved, passed, gains."],
  ["success-foreground", "Text on success."],
  ["warning", "Caution status that needs attention but isn't an error."],
  ["warning-foreground", "Text on warning."],
  ["chart-1", "First chart series; the brand colour."],
  ["chart-2", "Second chart series."],
  ["chart-3", "Third chart series."],
  ["chart-4", "Fourth chart series."],
  ["chart-5", "Fifth chart series."],
];

const GROUP_NAMES: Record<FamilySlot, string> = { display: "Headings", body: "Text", mono: "Code" };

/** Builds tokens.json in the Design System's list shape (never DTCG): colour, type, spacing, radius, shadow. */
export function claudeTokens(project: Project, themes: ExportTheme[], fonts: BundledFont[]) {
  return {
    name: project.meta.name,
    version: 1,
    color: {
      // The first theme is the fallback for any token missing a value, so light always leads.
      themes: themes.map(({ id, name }) => ({ id, name })),
      tokens: COLOUR_USAGE.map(([name, usage]) => ({
        name,
        value: Object.fromEntries(themes.map(theme => [theme.id, theme.colours[name]])),
        usage,
      })),
    },
    type: typeTokens(project.type, fonts),
    spacing: { tokens: spacingTokens(project.shape) },
    // Left out until chosen; export is blocked meanwhile.
    ...(project.shape.radii && { radius: { tokens: radiusTokens(project.shape) } }),
    shadow: { tokens: shadowTokens(project.shape) },
  };
}

// Google fonts are named in families only; Claude loads them itself, so they need no file.
// Uploaded fonts are listed in `fonts` with the file bundled next to tokens.json.
function typeTokens(type: Project["type"], fonts: BundledFont[]) {
  const styles = typeStyles(type);
  const families = Object.fromEntries(FAMILY_SLOTS.map(slot => [slot, fontStack(type.families[slot], slot)]));
  // Groups follow each role's actual family, so a role moved to another font moves group too.
  const groups = FAMILY_SLOTS.map(slot => ({
    name: GROUP_NAMES[slot],
    family: slot,
    styles: TEXT_ROLES.filter(role => styles[role].family === slot).map(role => typeStyle(role, styles[role])),
  })).filter(group => group.styles.length > 0);
  const files = fonts.map(font => ({ family: font.family, file: `fonts/${font.file}`, weight: String(font.weight) }));
  return { fonts: files, families, groups };
}

function typeStyle(name: string, style: TypeStyle) {
  return {
    name,
    fontSize: `${style.size}px`,
    lineHeight: `${style.lineHeight}px`,
    fontWeight: style.weight,
    ...(style.letterSpacing !== 0 && { letterSpacing: `${style.letterSpacing}em` }),
    ...(style.case !== "none" && { textTransform: textTransform(style.case) }),
    usage: style.usage,
  };
}
