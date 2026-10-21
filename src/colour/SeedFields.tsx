import { setSeed } from "@/core/palette-editing";
import type { PaletteSeeds } from "@/core/project";
import { TokenName } from "@/shell/TokenName";
import { useProjectStore } from "@/state/project-store";

/** A seed colour that is a single hex value (everything except the grey tint). */
export type HexSeed = Exclude<keyof PaletteSeeds, "neutralHue">;

/** One seed colour picker. Shared by the Colour step and the preview inspector. */
export function SeedField({ seed, label }: { seed: HexSeed; label: string }) {
  const value = useProjectStore(state => state.project.palette.seeds[seed]);
  const updateProject = useProjectStore(state => state.updateProject);

  return (
    <span className="flex items-center gap-2">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="color"
          value={value}
          onChange={event => {
            const hex = event.target.value;
            updateProject(project => setSeed(project, seed, hex));
          }}
          className="h-8 w-10 cursor-pointer rounded border bg-transparent"
        />
        {label}
      </label>
      <TokenName>{value}</TokenName>
    </span>
  );
}

/** The grey tint: which hue the greys lean towards, and how strongly. */
export function GreyTintFields() {
  const { hue, chroma } = useProjectStore(state => state.project.palette.seeds.neutralHue);
  const updateProject = useProjectStore(state => state.updateProject);

  return (
    <div className="flex flex-wrap gap-4">
      <label className="flex items-center gap-2 text-sm">
        Grey tint
        <input
          type="range"
          min={0}
          max={360}
          value={hue}
          onChange={event => {
            const next = Number(event.target.value);
            updateProject(project =>
              setSeed(project, "neutralHue", { ...project.palette.seeds.neutralHue, hue: next }),
            );
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
          value={chroma}
          onChange={event => {
            const next = Number(event.target.value);
            updateProject(project =>
              setSeed(project, "neutralHue", { ...project.palette.seeds.neutralHue, chroma: next }),
            );
          }}
        />
      </label>
    </div>
  );
}
