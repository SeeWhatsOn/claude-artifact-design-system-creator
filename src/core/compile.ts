import { deriveLightTheme, type ThemeColours } from "./colour/derive-theme";
import { claudeDesignSystemFiles } from "./export/claude-design-system";
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
  const light = withOverrides(deriveLightTheme(project.palette.seeds), project.palette.overrides.light);
  const files = claudeDesignSystemFiles(project, [{ id: "light", name: "Light", colours: light }], now);
  return { preview: { light: toCssVars(light), fontsToLoad: [] }, diagnostics: [], files };
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
