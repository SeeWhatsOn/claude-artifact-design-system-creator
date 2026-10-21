import { setDensity, setSpacingBase } from "@/core/shape-editing";
import type { Shape } from "@/core/project";
import { SegmentedControl } from "@/shell/SegmentedControl";
import { TokenName } from "@/shell/TokenName";
import { useProjectStore } from "@/state/project-store";

const BASES: { value: Shape["spacingBase"]; label: string }[] = [
  { value: 4, label: "4px grid" },
  { value: 8, label: "8px grid" },
];

const DENSITIES: { value: Shape["density"]; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "airy", label: "Airy" },
];

/** The spacing grid and how roomy the layout feels. */
export function SpacingControls() {
  const { spacingBase, density } = useProjectStore(state => state.project.shape);
  const updateProject = useProjectStore(state => state.updateProject);

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium">Spacing</legend>
      <SegmentedControl
        label="Spacing grid"
        options={BASES}
        value={spacingBase}
        onChange={value => updateProject(project => setSpacingBase(project, value))}
      />
      <SegmentedControl
        label="Density"
        options={DENSITIES}
        value={density}
        onChange={value => updateProject(project => setDensity(project, value))}
      />
      <p className="flex gap-2">
        <TokenName>--space-1</TokenName>
        <TokenName>to</TokenName>
        <TokenName>--space-6</TokenName>
      </p>
    </fieldset>
  );
}
