import { useEffect } from "react";
import type { ProjectAssets } from "@/core/project-file";
import type { FontRef } from "@/core/project";

// Registered once per page: the browser keeps a FontFace for the page's lifetime.
const registered = new Set<string>();

/** Registers each uploaded font file with the browser (FontFace API) so the preview can render it. */
export function useUploadedFonts(fonts: readonly FontRef[], assets: ProjectAssets): void {
  useEffect(() => {
    // Missing in some test and older environments; the preview then shows the fallback font.
    if (typeof FontFace === "undefined" || !document.fonts) return;
    for (const font of fonts) {
      for (const file of font.files ?? []) {
        const bytes = assets[file.assetId];
        if (!bytes || registered.has(file.assetId)) continue;
        registered.add(file.assetId);
        // Copied into a plain ArrayBuffer-backed array, which is what FontFace accepts.
        const face = new FontFace(font.family, new Uint8Array(bytes), { weight: String(file.weight) });
        document.fonts.add(face);
        face.load().catch(() => registered.delete(file.assetId));
      }
    }
  }, [fonts, assets]);
}
