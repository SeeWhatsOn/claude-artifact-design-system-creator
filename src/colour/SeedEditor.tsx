import { Lock, LockOpen, Shuffle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { randomisePalette, setSeed, type SeedGroup } from "@/core/palette-editing";
import type { PaletteSeeds } from "@/core/project";
import { TokenName } from "@/shell/TokenName";
import { projectStore, useProjectStore } from "@/state/project-store";

type HexSeed = Exclude<keyof PaletteSeeds, "neutralHue">;

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
  const seeds = useProjectStore(state => state.project.palette.seeds);
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
              <span key={field.key} className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="color"
                    value={seeds[field.key]}
                    onChange={event => {
                      const hex = event.target.value;
                      updateProject(project => setSeed(project, field.key, hex));
                    }}
                    className="h-8 w-10 cursor-pointer rounded border bg-transparent"
                  />
                  {field.label}
                </label>
                <TokenName>{seeds[field.key]}</TokenName>
              </span>
            ))}
            <label className="ml-auto flex cursor-pointer items-center gap-1 text-xs text-muted-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring">
              <input type="checkbox" checked={locked} onChange={() => toggleLock(group)} className="sr-only" />
              {locked ? <Lock aria-hidden className="size-3.5" /> : <LockOpen aria-hidden className="size-3.5" />}
              <span>Lock {label}</span>
            </label>
          </div>
        );
      })}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          Grey tint
          <input
            type="range"
            min={0}
            max={360}
            value={seeds.neutralHue.hue}
            onChange={event => {
              const hue = Number(event.target.value);
              updateProject(project => setSeed(project, "neutralHue", { ...project.palette.seeds.neutralHue, hue }));
            }}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          Tint strength
          <input
            type="range"
            min={0}
            max={0.04}
            step={0.001}
            value={seeds.neutralHue.chroma}
            onChange={event => {
              const chroma = Number(event.target.value);
              updateProject(project => setSeed(project, "neutralHue", { ...project.palette.seeds.neutralHue, chroma }));
            }}
          />
        </label>
      </div>
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
