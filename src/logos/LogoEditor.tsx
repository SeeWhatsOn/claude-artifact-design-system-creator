import { Trash2, Upload } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { addLogo, removeLogo, setLogoTheme } from "@/core/logos/logo-editing";
import { prepareLogoUpload } from "@/core/logos/logo-files";
import type { Logo } from "@/core/project";
import { useAssetStore } from "@/state/asset-store";
import { useProjectStore } from "@/state/project-store";
import { useLogoUrls } from "./use-logo-urls";

const THEME_OPTIONS: [Logo["theme"], string][] = [
  ["any", "Both themes"],
  ["light", "Light theme"],
  ["dark", "Dark theme"],
];

/** Uploads, lists and removes logo variants, each marked for the light theme, the dark theme or both. */
export function LogoEditor() {
  const logos = useProjectStore(state => state.project.logos);
  const updateProject = useProjectStore(state => state.updateProject);
  const assets = useAssetStore(state => state.assets);
  const addAssets = useAssetStore(state => state.addAssets);
  const urls = useLogoUrls(logos, assets);
  const [problem, setProblem] = useState<string | null>(null);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const picked = input.files?.[0];
    // Cleared so picking the same file again still fires a change.
    input.value = "";
    if (!picked) return;
    const result = prepareLogoUpload({ name: picked.name, bytes: new Uint8Array(await picked.arrayBuffer()) }, () =>
      crypto.randomUUID(),
    );
    if (!result.ok) return setProblem(result.error);
    setProblem(null);
    // Assets first, so the project never points at a file that isn't stored yet.
    addAssets(result.assets);
    updateProject(project => addLogo(project, result.logo));
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm has-focus-visible:ring-2 has-focus-visible:ring-ring">
          <Upload aria-hidden className="size-4" />
          Upload logo
          <input type="file" accept=".svg,.png,image/svg+xml,image/png" onChange={upload} className="sr-only" />
        </label>
        <p className="text-xs text-muted-foreground">
          SVG or PNG. Add one for each theme if your logo changes on dark. With no logo, Claude writes your name in
          plain type.
        </p>
        {problem && (
          <p role="alert" className="text-sm text-destructive">
            {problem}
          </p>
        )}
      </div>
      {logos.length > 0 && (
        <ul aria-label="Logos" className="space-y-2">
          {logos.map(logo => (
            <li key={logo.id} className="flex flex-wrap items-center gap-3 rounded-md border p-2">
              {/* Checkerboard behind the thumbnail so white or black marks stay visible. */}
              <div className="flex h-10 w-20 items-center justify-center rounded bg-[repeating-conic-gradient(#e5e5e5_0_25%,#fff_0_50%)] bg-[length:12px_12px]">
                {urls[logo.assetId] && (
                  <img src={urls[logo.assetId]} alt={logo.name} className="max-h-8 max-w-18 object-contain" />
                )}
              </div>
              <span className="min-w-0 flex-1 truncate text-sm">{logo.name}</span>
              <select
                aria-label={`Theme for ${logo.name}`}
                value={logo.theme}
                onChange={event => {
                  const theme = THEME_OPTIONS.find(([value]) => value === event.target.value)?.[0];
                  if (theme) updateProject(project => setLogoTheme(project, logo.id, theme));
                }}
                className="rounded-md border bg-background px-2 py-1 text-sm"
              >
                {THEME_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove ${logo.name}`}
                onClick={() => updateProject(project => removeLogo(project, logo.id))}
              >
                <Trash2 aria-hidden className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
