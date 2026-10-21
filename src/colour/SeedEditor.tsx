import { Lock, LockOpen, Shuffle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { randomisePalette, type SeedGroup } from "@/core/palette-editing";
import { projectStore, useProjectStore } from "@/state/project-store";
import { GreyTintFields, SeedField, type HexSeed } from "./SeedFields";

// Plain-language labels; the seed names stay out of sight.
const GROUPS: { group: SeedGroup; label: string; seeds: { key: HexSeed; label: string }[] }[] = [
  {
    group: "brand",
    label: "main colour",
    seeds: [
      { key: "brand", label: "Main colour" },
      { key: "brandForeground", label: "Text on main colour" },
    ],
  },
  {
    group: "neutral",
    label: "greys",
    seeds: [
      { key: "neutralLightBg", label: "Light page background" },
      { key: "neutralDarkBg", label: "Dark page background" },
    ],
  },
  { group: "accent", label: "highlight colour", seeds: [{ key: "accent", label: "Highlight colour" }] },
  { group: "success", label: "success colour", seeds: [{ key: "success", label: "Success colour" }] },
  { group: "warning", label: "warning colour", seeds: [{ key: "warning", label: "Warning colour" }] },
  { group: "danger", label: "danger colour", seeds: [{ key: "danger", label: "Danger colour" }] },
];

/** Edits the few seed colours everything else is derived from, with randomise and per-group locks. */
export function SeedEditor() {
  const updateProject = useProjectStore(state => state.updateProject);
  const [locks, setLocks] = useState<ReadonlySet<SeedGroup>>(new Set());
  const [problem, setProblem] = useState<string | null>(null);

  function toggleLock(group: SeedGroup) {
    const next = new Set(locks);
    if (!next.delete(group)) next.add(group);
    setLocks(next);
  }

  function randomise() {
    const result = randomisePalette(projectStore.getState().project, locks);
    if (!result.ok) return setProblem(result.reason);
    setProblem(null);
    updateProject(() => result.project);
  }

  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-medium">Colours</legend>
      {GROUPS.map(({ group, label, seeds: fields }) => {
        const locked = locks.has(group);
        return (
          <div key={group} className="flex flex-wrap items-end gap-3">
            {fields.map(field => (
              <SeedField key={field.key} seed={field.key} label={field.label} />
            ))}
            <label className="ml-auto flex cursor-pointer items-center gap-1 text-xs text-muted-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring">
              <input type="checkbox" checked={locked} onChange={() => toggleLock(group)} className="sr-only" />
              {locked ? <Lock aria-hidden className="size-3.5" /> : <LockOpen aria-hidden className="size-3.5" />}
              <span>Lock {label}</span>
            </label>
          </div>
        );
      })}
      <GreyTintFields />
      <Button variant="secondary" onClick={randomise}>
        <Shuffle aria-hidden />
        Randomise unlocked colours
      </Button>
      {problem && (
        <p role="alert" className="text-sm text-destructive">
          {problem}
        </p>
      )}
    </fieldset>
  );
}
