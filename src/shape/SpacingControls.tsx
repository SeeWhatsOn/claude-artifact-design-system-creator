import { setDensity, setSpacingBase } from "@/core/shape-editing";
import type { Shape } from "@/core/project";
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
      <Choice
        name="Spacing grid"
        options={BASES}
        value={spacingBase}
        onChange={value => updateProject(project => setSpacingBase(project, value))}
      />
      <Choice
        name="Density"
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

/** A row of mutually exclusive options shown as buttons. */
export function Choice<T extends string | number>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-1 text-sm">
      {options.map(option => (
        <label
          key={option.value}
          className="cursor-pointer rounded-md border px-2 py-1 has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-2 has-focus-visible:ring-ring"
        >
          <input
            type="radio"
            name={name}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
