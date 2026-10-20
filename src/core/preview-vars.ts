import type { ThemeColours } from "./colour/derive-theme";
import type { CssVarMap } from "./compile";
import { FAMILY_SLOTS, TEXT_ROLES, type FontRef, type Project } from "./project";
import { fontStack, typeStyles } from "./type/type-scale";

const TEXT_TRANSFORM = { none: "none", upper: "uppercase", lower: "lowercase", title: "capitalize" } as const;

/** One theme's colours as `--token` variables, the names shadcn components read. */
export function colourVars(colours: ThemeColours): CssVarMap {
  return Object.fromEntries(Object.entries(colours).map(([name, value]) => [`--${name}`, value]));
}

/** Font stacks per slot and every text role's size, leading, weight, tracking and case, as `--type-<role>-*`. */
export function typeVars(type: Project["type"]): CssVarMap {
  const vars: CssVarMap = {};
  for (const slot of FAMILY_SLOTS) vars[`--font-${slot}`] = fontStack(type.families[slot], slot);
  const styles = typeStyles(type);
  for (const role of TEXT_ROLES) {
    const style = styles[role];
    vars[`--type-${role}-family`] = fontStack(type.families[style.family], style.family);
    vars[`--type-${role}-size`] = `${style.size}px`;
    vars[`--type-${role}-line-height`] = `${style.lineHeight}px`;
    vars[`--type-${role}-weight`] = String(style.weight);
    vars[`--type-${role}-tracking`] = `${style.letterSpacing}em`;
    vars[`--type-${role}-case`] = TEXT_TRANSFORM[style.case];
  }
  return vars;
}

/** The fonts the preview must load, each family once (a pairing may use one family in two slots). */
export function fontsToLoad(type: Project["type"]): FontRef[] {
  const seen = new Set<string>();
  return FAMILY_SLOTS.map(slot => type.families[slot]).filter(font => {
    const key = `${font.source}:${font.family}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Maps a role's case to CSS text-transform, shared by the preview and the export. */
export function textTransform(value: keyof typeof TEXT_TRANSFORM): string {
  return TEXT_TRANSFORM[value];
}
