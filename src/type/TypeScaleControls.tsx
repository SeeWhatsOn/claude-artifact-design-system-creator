import { setRatio, setTypeBase } from "@/core/type-editing";
import { TYPE_RATIOS } from "@/core/type/type-scale";
import { SegmentedControl } from "@/shell/SegmentedControl";
import { TokenName } from "@/shell/TokenName";
import { useProjectStore } from "@/state/project-store";

const RATIO_OPTIONS = TYPE_RATIOS.map(option => ({ value: option.ratio, label: `${option.name} ${option.ratio}` }));

/** The body size and the named ratio every text role is generated from. */
export function TypeScaleControls() {
  const { base, ratio } = useProjectStore(state => state.project.type);
  const updateProject = useProjectStore(state => state.updateProject);

  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-medium">Text sizes</legend>
      <span className="flex flex-wrap items-center gap-2">
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
        <TokenName>--type-body-size</TokenName>
      </span>
      <SegmentedControl
        label="Size contrast"
        options={RATIO_OPTIONS}
        value={ratio}
        onChange={value => updateProject(project => setRatio(project, value))}
      />
      <TokenName>type.ratio = {ratio}</TokenName>
    </fieldset>
  );
}
