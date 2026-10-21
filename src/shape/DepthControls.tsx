import { setBorders, setShadow } from "@/core/shape-editing";
import type { Shape } from "@/core/project";
import { TokenName } from "@/shell/TokenName";
import { useProjectStore } from "@/state/project-store";
import { SegmentedControl } from "@/shell/SegmentedControl";

type ShadowNumber = "opacity" | "blur" | "spread" | "x" | "y";

const SHADOW_FIELDS: { key: ShadowNumber; label: string; min: number; max: number; step: number }[] = [
  { key: "opacity", label: "Shadow strength", min: 0, max: 1, step: 0.01 },
  { key: "blur", label: "Blur (px)", min: 0, max: 40, step: 1 },
  { key: "spread", label: "Spread (px)", min: -10, max: 10, step: 1 },
  { key: "x", label: "Offset across (px)", min: -20, max: 20, step: 1 },
  { key: "y", label: "Offset down (px)", min: -20, max: 20, step: 1 },
];

const BORDERS: { value: Shape["borders"]; label: string }[] = [
  { value: "hairline", label: "Hairline borders" },
  { value: "none", label: "No borders" },
];

/** Shadow builder (or flat) and borders: how surfaces separate from the page. */
export function DepthControls() {
  const { shadow, borders } = useProjectStore(state => state.project.shape);
  const updateProject = useProjectStore(state => state.updateProject);

  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-medium">Depth and borders</legend>
      <SegmentedControl
        label="Depth"
        options={[
          { value: "shadow", label: "Shadows" },
          { value: "flat", label: "Flat, no shadows" },
        ]}
        value={shadow.enabled ? "shadow" : "flat"}
        onChange={value => updateProject(project => setShadow(project, { enabled: value === "shadow" }))}
      />
      <TokenName>--shadow-raised, --shadow-overlay</TokenName>
      {shadow.enabled && (
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="color"
              value={shadow.colour}
              onChange={event => {
                const colour = event.target.value;
                updateProject(project => setShadow(project, { colour }));
              }}
              className="h-8 w-10 cursor-pointer rounded border bg-transparent"
            />
            Shadow colour
          </label>
          {SHADOW_FIELDS.map(field => (
            <label key={field.key} className="flex items-center gap-2 text-sm">
              <span className="w-36">{field.label}</span>
              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={shadow[field.key]}
                onChange={event => {
                  const value = Number(event.target.value);
                  updateProject(project => setShadow(project, { [field.key]: value }));
                }}
              />
            </label>
          ))}
        </div>
      )}
      <SegmentedControl
        label="Borders"
        options={BORDERS}
        value={borders}
        onChange={value => updateProject(project => setBorders(project, value))}
      />
      <TokenName>--border-width</TokenName>
    </fieldset>
  );
}
