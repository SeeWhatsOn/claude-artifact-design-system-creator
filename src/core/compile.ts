import { checkContrast } from "./colour/contrast-check";
import { deriveTheme, type ThemeColours, type ThemeId } from "./colour/derive-theme";
import { checkPaletteTells } from "./colour/palette-tells";
import { claudeDesignSystemFiles, type ExportTheme } from "./export/claude-design-system";
import { bundledLogos, checkLogos } from "./logos/bundled-logos";
import { colourVars, fontsToLoad, shapeVars, typeVars } from "./preview-vars";
import type { FontRef, Project } from "./project";
import type { ProjectAssets } from "./project-file";
import { checkShape } from "./shape/check-shape";
import { checkFlaggedFonts } from "./type/flagged-fonts";
import { bundledFonts, checkUploadedFonts } from "./type/uploaded-fonts";

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

/** Inputs that aren't part of the project. `now` stamps the export; tests pin it. `assets` holds uploaded files. */
export type CompileOptions = { now?: Date; assets?: ProjectAssets };

/** The single entry point to the design core: turns a project into preview vars, diagnostics and export files. */
export function compile(project: Project, { now = new Date(), assets = {} }: CompileOptions = {}): CompileOutput {
  const light = themeColours(project, "light");
  const dark = project.darkEnabled ? themeColours(project, "dark") : undefined;
  // Light always leads: Claude's Design System falls back to the first theme.
  const themes: ExportTheme[] = [{ id: "light", name: "Light", colours: light }];
  if (dark) themes.push({ id: "dark", name: "Dark", colours: dark });
  // Type and shape don't change with the theme, so both themes carry the same variables.
  const shared = { ...typeVars(project.type), ...shapeVars(project.shape) };
  const preview = {
    light: { ...colourVars(light), ...shared },
    ...(dark && { dark: { ...colourVars(dark), ...shared } }),
    fontsToLoad: fontsToLoad(project.type),
  };
  const diagnostics = [
    ...themes.flatMap(theme => checkContrast(theme.colours, theme.id)),
    ...checkPaletteTells(project.palette.seeds),
    ...checkShape(project.shape),
    ...checkFlaggedFonts(project.type),
    ...checkUploadedFonts(project.type, assets),
    ...checkLogos(project.logos, assets),
  ];
  const fonts = bundledFonts(project.type, assets);
  const logos = bundledLogos(project.logos, assets);
  const files = claudeDesignSystemFiles(project, themes, { now, diagnostics, fonts, logos });
  return { preview, diagnostics, files };
}

function themeColours(project: Project, theme: ThemeId): ThemeColours {
  return deriveTheme(project.palette.seeds, theme, project.palette.overrides[theme]);
}
