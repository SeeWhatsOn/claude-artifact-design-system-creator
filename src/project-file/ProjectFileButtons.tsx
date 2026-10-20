import { FolderOpen, Save } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { readProjectFile, usedAssets, writeProjectFile } from "@/core/project-file";
import { downloadFile } from "@/download/download-file";
import { useAssetStore } from "@/state/asset-store";
import { useProjectStore } from "@/state/project-store";

type Status = { kind: "done" | "error"; message: string } | null;

/** Saves the whole system as one project file, and opens one saved earlier or on another machine. */
export function ProjectFileButtons() {
  const project = useProjectStore(state => state.project);
  const updateProject = useProjectStore(state => state.updateProject);
  const assets = useAssetStore(state => state.assets);
  const addAssets = useAssetStore(state => state.addAssets);
  const [status, setStatus] = useState<Status>(null);

  function save() {
    const file = writeProjectFile(project, usedAssets(project, assets));
    downloadFile(`${project.meta.namespace}.brandkit.json`, file, "application/json");
  }

  async function open(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    const result = readProjectFile(await file.text());
    // Cleared so picking the same file again still fires a change.
    input.value = "";
    if (!result.ok) return setStatus({ kind: "error", message: result.error });
    // Assets first, so the opened project never points at a file that isn't stored yet.
    addAssets(result.assets);
    updateProject(() => result.project);
    setStatus({ kind: "done", message: `Opened ${result.project.meta.name}.` });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="ghost" asChild>
        <label className="cursor-pointer has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
          <FolderOpen aria-hidden />
          Open project
          <input type="file" accept=".json,application/json" onChange={open} className="sr-only" />
        </label>
      </Button>
      <Button variant="ghost" onClick={save}>
        <Save aria-hidden />
        Save project
      </Button>
      {status && (
        <p role={status.kind === "error" ? "alert" : "status"} className="text-sm text-muted-foreground">
          {status.message}
        </p>
      )}
    </div>
  );
}
