import { setRadius } from "@/core/shape-editing";
import type { Shape } from "@/core/project";
import { DEFAULT_RADII } from "@/core/shape/default-shape";
import { useProjectStore } from "@/state/project-store";

type Radii = NonNullable<Shape["radii"]>;

const RADII: { key: keyof Radii; label: string; max: number }[] = [
  { key: "control", label: "Buttons and inputs", max: 24 },
  { key: "card", label: "Cards", max: 32 },
  { key: "dialog", label: "Dialogs", max: 40 },
  { key: "pill", label: "Badges and pills", max: 999 },
];

/** Four corner radii by hierarchy, so controls, cards, dialogs and pills don't share one radius. */
export function RadiusControls() {
  const radii = useProjectStore(state => state.project.shape.radii);
  const updateProject = useProjectStore(state => state.updateProject);

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium">Corners</legend>
      {!radii && <p className="text-sm text-muted-foreground">Not chosen yet. Set any corner to start.</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {RADII.map(({ key, label, max }) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <span className="w-32">{label} (px)</span>
            <input
              type="number"
              min={0}
              max={max}
              value={radii?.[key] ?? DEFAULT_RADII[key]}
              onChange={event => {
                const value = Number(event.target.value);
                if (Number.isFinite(value) && value >= 0) updateProject(project => setRadius(project, key, value));
              }}
              className="w-20 rounded-md border bg-background px-2 py-1"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
