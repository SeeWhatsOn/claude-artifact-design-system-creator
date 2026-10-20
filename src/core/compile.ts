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

/** The single entry point to the design core: turns a project into preview vars, diagnostics and export files. */
export function compile(_project: Project): CompileOutput {
  // The colour engine, type scale, rules compiler and exporters plug in here from #3 on.
  return { preview: { light: {}, fontsToLoad: [] }, diagnostics: [], files: {} };
}
