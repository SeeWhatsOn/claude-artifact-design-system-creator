import type { Diagnostic } from "../compile";
import type { Logo } from "../project";
import type { ProjectAssets } from "../project-file";
import { detectLogoFormat, LOGO_MEDIA_TYPES } from "./logo-files";

/** One logo file to bundle: its export file name, media type, theme and bytes. */
export type BundledLogo = { name: string; file: string; type: string; theme: Logo["theme"]; bytes: Uint8Array };

/**
 * Every logo whose bytes are stored and readable, in upload order. File names are derived here rather than
 * stored, from the logo's name, theme and sniffed format, so the project schema needs no file field.
 */
export function bundledLogos(logos: readonly Logo[], assets: ProjectAssets): BundledLogo[] {
  const taken = new Set<string>();
  return logos.flatMap(logo => {
    const bytes = assets[logo.assetId];
    const format = bytes && detectLogoFormat(bytes);
    if (!bytes || !format) return [];
    const base = [slug(logo.name), logo.theme === "any" ? "" : logo.theme].filter(Boolean).join("-");
    let file = `${base}.${format}`;
    for (let n = 2; taken.has(file); n++) file = `${base}-${n}.${format}`;
    taken.add(file);
    return [{ name: logo.name, file, type: LOGO_MEDIA_TYPES[format], theme: logo.theme, bytes }];
  });
}

/** Blocks export when a logo's file is missing or unreadable, since Claude would get a broken mark. */
export function checkLogos(logos: readonly Logo[], assets: ProjectAssets): Diagnostic[] {
  return logos.flatMap((logo, index) => {
    const bytes = assets[logo.assetId];
    if (bytes && detectLogoFormat(bytes)) return [];
    return [
      {
        severity: "block",
        code: "logo-file-missing",
        message: `The file for the logo ${logo.name} is missing. Upload it again or remove it.`,
        step: "logos",
        path: `logos.${index}`,
      },
    ];
  });
}

// Lowercase ASCII words joined by dashes: safe in a zip path and in the index's file keys.
function slug(name: string): string {
  return (
    name
      .normalize("NFD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "logo"
  );
}
