import type { ThemeId } from "@/core/colour/derive-theme";
import { logoForTheme } from "@/core/logos/logo-editing";
import { useAssetStore } from "@/state/asset-store";
import { useProjectStore } from "@/state/project-store";
import { useLogoUrls } from "./use-logo-urls";

/** The brand mark for one preview theme: the matching logo, or the brand name in the display font when there is none. */
export function PreviewLogo({ theme }: { theme: ThemeId }) {
  const logos = useProjectStore(state => state.project.logos);
  const name = useProjectStore(state => state.project.meta.name);
  const assets = useAssetStore(state => state.assets);
  const urls = useLogoUrls(logos, assets);
  const logo = logoForTheme(logos, theme);
  const url = logo && urls[logo.assetId];

  if (logo && url) return <img src={url} alt={logo.name} className="h-8 w-auto max-w-40 object-contain" />;
  return (
    <span className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
      {name}
    </span>
  );
}
