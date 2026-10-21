import { useMemo } from "react";
import { detectLogoFormat, LOGO_MEDIA_TYPES } from "@/core/logos/logo-files";
import type { Logo } from "@/core/project";
import type { ProjectAssets } from "@/core/project-file";

// One URL per asset for the page's lifetime. Asset ids are unique and their bytes never change (the store
// is append-only, so undo can revive a removed logo), so URLs are never revoked, like registered fonts.
const urlCache = new Map<string, string>();

/**
 * Object URLs for each logo's bytes, by asset id. Logos are shown through <img> only, never inlined,
 * so an uploaded SVG can't run scripts in the app.
 */
export function useLogoUrls(logos: readonly Logo[], assets: ProjectAssets): Record<string, string> {
  return useMemo(() => {
    const urls: Record<string, string> = {};
    for (const { assetId } of logos) {
      const cached = urlCache.get(assetId);
      if (cached) {
        urls[assetId] = cached;
        continue;
      }
      const bytes = assets[assetId];
      const format = bytes && detectLogoFormat(bytes);
      if (!bytes || !format) continue;
      // The media type matters: browsers only render an SVG blob typed image/svg+xml.
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: LOGO_MEDIA_TYPES[format] }));
      urlCache.set(assetId, url);
      urls[assetId] = url;
    }
    return urls;
  }, [logos, assets]);
}
