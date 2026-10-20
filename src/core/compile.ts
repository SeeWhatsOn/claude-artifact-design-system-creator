import { deriveTheme, type ThemeColours, type ThemeId } from "./colour/derive-theme";
import { claudeDesignSystemFiles, type ExportTheme } from "./export/claude-design-system";
import type { FontRef, Project } from "./project";

/** CSS custom property name (e.g. "--primary") to value. */
export type CssVarMap = Record<string, string>;

/** A problem or note about the project, shown in the UI and used to gate export. */
export type Diagnostic = {
  severity: "block" | "warn" | "info";
  code: string;
  message: string;
  step: string;
  path: string;
};

/** Export path to file contents. */
export type FileMap = Record<string, string | Uint8Array>;

/** Everything the UI and exporters need from a project. */
export type CompileOutput = {
  preview: { light: CssVarMap; dark?: CssVarMap; fontsToLoad: FontRef[] };
  diagnostics: Diagnostic[];
  files: FileMap;
};

/** Inputs that aren't part of the project. `now` stamps the export; tests pin it. */
export type CompileOptions = { now?: Date };

/** The single entry point to the design core: turns a project into preview vars, diagnostics and export files. */
export function compile(project: Project, { now = new Date() }: CompileOptions = {}): CompileOutput {
  const light = themeColours(project, "light");
  const dark = project.darkEnabled ? themeColours(project, "dark") : undefined;
  // Light always leads: Claude's Design System falls back to the first theme.
  const themes: ExportTheme[] = [{ id: "light", name: "Light", colours: light }];
  if (dark) themes.push({ id: "dark", name: "Dark", colours: dark });
  const preview = { light: toCssVars(light), ...(dark && { dark: toCssVars(dark) }), fontsToLoad: [] };
  return { preview, diagnostics: [], files: claudeDesignSystemFiles(project, themes, now) };
}

function themeColours(project: Project, theme: ThemeId): ThemeColours {
  return withOverrides(deriveTheme(project.palette.seeds, theme), project.palette.overrides[theme]);
}

// Overrides win over derived values; they are keyed by token name without the leading dashes.
function withOverrides(colours: ThemeColours, overrides: Record<string, string>): ThemeColours {
  const result: ThemeColours = { ...colours };
  for (const [name, value] of Object.entries(overrides)) {
    if (name in result) result[name as keyof ThemeColours] = value.toLowerCase();
  }
  return result;
}

function toCssVars(colours: ThemeColours): CssVarMap {
  return Object.fromEntries(Object.entries(colours).map(([name, value]) => [`--${name}`, value]));
}
