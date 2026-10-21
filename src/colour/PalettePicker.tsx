import { useId } from "react";
import { applyPalette, PALETTES } from "@/core/palettes";
import { PickerStrip, STRIP_OPTION, usePinnedFirst } from "@/shell/PickerStrip";
import { useProjectStore } from "@/state/project-store";

/** Lets the user pick one of the curated palettes, each shown with its seed swatches, from a scrolling strip. */
export function PalettePicker() {
  const paletteId = useProjectStore(state => state.project.palette.paletteId);
  const updateProject = useProjectStore(state => state.updateProject);
  // The picker can show twice (Colour step and preview inspector); each copy needs its own radio group.
  const name = useId();
  const palettes = usePinnedFirst(PALETTES, paletteId);

  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="mb-2 text-sm font-medium">Palette</legend>
      <PickerStrip label="Palette" selected={paletteId}>
        {palettes.map(palette => {
          const { brand, accent, neutralLightBg, neutralDarkBg } = palette.seeds;
          return (
            <label key={palette.id} className={`${STRIP_OPTION} w-44 items-center gap-3`}>
              <input
                type="radio"
                name={name}
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
      </PickerStrip>
    </fieldset>
  );
}
