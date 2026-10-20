import { applyPalette, PALETTES } from "@/core/palettes";
import { useProjectStore } from "@/state/project-store";

/** Lets the user pick one of the 20 curated palettes, each shown with its seed swatches. */
export function PalettePicker() {
  const paletteId = useProjectStore(state => state.project.palette.paletteId);
  const updateProject = useProjectStore(state => state.updateProject);

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium">Palette</legend>
      <div role="radiogroup" aria-label="Palette" className="grid gap-2 sm:grid-cols-2">
        {PALETTES.map(palette => {
          const { brand, accent, neutralLightBg, neutralDarkBg } = palette.seeds;
          return (
            <label
              key={palette.id}
              className="flex cursor-pointer items-center gap-3 rounded-md border p-2 has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-2 has-focus-visible:ring-ring"
            >
              <input
                type="radio"
                name="palette"
                value={palette.id}
                checked={palette.id === paletteId}
                onChange={() => updateProject(project => applyPalette(project, palette.id))}
                className="sr-only"
              />
              <span aria-hidden className="flex shrink-0 overflow-hidden rounded-sm border">
                {[brand, accent, neutralLightBg, neutralDarkBg].map((colour, index) => (
                  <span key={index} className="size-5" style={{ backgroundColor: colour }} />
                ))}
              </span>
              <span className="text-sm">{palette.name}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
