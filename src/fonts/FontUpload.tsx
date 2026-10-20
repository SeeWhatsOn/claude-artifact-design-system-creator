import { Upload } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import type { FamilySlot } from "@/core/project";
import { setFamily } from "@/core/type-editing";
import { prepareFontUpload } from "@/core/type/font-files";
import { useAssetStore } from "@/state/asset-store";
import { useProjectStore } from "@/state/project-store";

/** Uploads the user's own font files into one slot; they preview at once and are bundled into the export. */
export function FontUpload({ slot }: { slot: FamilySlot }) {
  const updateProject = useProjectStore(state => state.updateProject);
  const addAssets = useAssetStore(state => state.addAssets);
  const [problem, setProblem] = useState<string | null>(null);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const picked = [...(input.files ?? [])];
    // Cleared so picking the same files again still fires a change.
    input.value = "";
    if (picked.length === 0) return;
    const files = await Promise.all(
      picked.map(async file => ({ name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) })),
    );
    const result = prepareFontUpload(files, () => crypto.randomUUID());
    if (!result.ok) return setProblem(result.error);
    setProblem(null);
    // Assets first, so the project never points at a file that isn't stored yet.
    addAssets(result.assets);
    updateProject(project => setFamily(project, slot, result.font));
  }

  return (
    <div className="space-y-1">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm has-focus-visible:ring-2 has-focus-visible:ring-ring">
        <Upload aria-hidden className="size-4" />
        Upload font files
        <input type="file" multiple accept=".woff2,.woff,.ttf,.otf" onChange={upload} className="sr-only" />
      </label>
      <p className="text-xs text-muted-foreground">
        woff2, woff, ttf or otf. Pick every weight of one family together. Uploaded fonts go into your export.
      </p>
      {problem && (
        <p role="alert" className="text-sm text-destructive">
          {problem}
        </p>
      )}
    </div>
  );
}
