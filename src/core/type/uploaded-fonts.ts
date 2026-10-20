import type { Diagnostic } from "../compile";
import { FAMILY_SLOTS, type FamilySlot, type FontRef, type Project } from "../project";
import type { ProjectAssets } from "../project-file";

/** One uploaded font file to bundle: where it goes in the export and its bytes. */
export type BundledFont = { family: string; file: string; weight: number; bytes: Uint8Array };

/** Every uploaded font file the project uses, each once, with its bytes. Files whose bytes are missing are skipped. */
export function bundledFonts(type: Project["type"], assets: ProjectAssets): BundledFont[] {
  const seen = new Set<string>();
  return uploads(type).flatMap(({ font }) =>
    (font.files ?? []).flatMap(file => {
      const bytes = assets[file.assetId];
      if (!bytes || seen.has(file.file)) return [];
      seen.add(file.file);
      return [{ family: font.family, file: file.file, weight: file.weight, bytes }];
    }),
  );
}

/** Blocks export when an uploaded font's file is missing, since Claude couldn't render it. */
export function checkUploadedFonts(type: Project["type"], assets: ProjectAssets): Diagnostic[] {
  return uploads(type)
    .filter(({ font }) => !font.files?.length || font.files.some(file => !assets[file.assetId]))
    .map(({ slot, font }) => ({
      severity: "block",
      code: "font-file-missing",
      message: `The file for ${font.family} is missing. Upload it again or pick another font.`,
      step: "type",
      path: `type.families.${slot}`,
    }));
}

function uploads(type: Project["type"]): { slot: FamilySlot; font: FontRef }[] {
  return FAMILY_SLOTS.map(slot => ({ slot, font: type.families[slot] })).filter(({ font }) => font.source === "upload");
}
