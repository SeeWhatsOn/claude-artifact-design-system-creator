import { setRatio, setTypeBase } from "@/core/type-editing";
import { TYPE_RATIOS } from "@/core/type/type-scale";
import { useProjectStore } from "@/state/project-store";

/** The body size and the named ratio every text role is generated from. */
export function TypeScaleControls() {
  const { base, ratio } = useProjectStore(state => state.project.type);
  const updateProject = useProjectStore(state => state.updateProject);

  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-medium">Text sizes</legend>
      <label className="flex items-center gap-2 text-sm">
        Body text size (px)
        <input
          type="number"
          min={12}
          max={24}
          value={base}
          onChange={event => {
            const value = Number(event.target.value);
            if (value >= 12 && value <= 24) updateProject(project => setTypeBase(project, value));
          }}
          className="w-16 rounded-md border bg-background px-2 py-1"
        />
      </label>
      <div role="radiogroup" aria-label="Size contrast" className="flex flex-wrap gap-1 text-sm">
        {TYPE_RATIOS.map(option => (
          <label
            key={option.ratio}
            className="cursor-pointer rounded-md border px-2 py-1 has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-2 has-focus-visible:ring-ring"
          >
            <input
              type="radio"
              name="type-ratio"
              checked={option.ratio === ratio}
              onChange={() => updateProject(project => setRatio(project, option.ratio))}
              className="sr-only"
            />
            {option.name} {option.ratio}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
