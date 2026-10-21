import { useId } from "react";
import { PATTERN_STATES, type PatternState } from "@/core/patterns/pattern-catalogue";

const LABELS: Record<PatternState, string> = { preferred: "Preferred", allowed: "Allowed", never: "Never" };

/** Preferred / allowed / never radio buttons for one pattern. */
export function PatternStateSwitch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: PatternState;
  onChange: (state: PatternState) => void;
}) {
  // Each pattern gets its own radio group name, so choices don't share a selection.
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md border p-0.5 text-sm">
      {PATTERN_STATES.map(option => (
        <label
          key={option}
          className="cursor-pointer rounded px-2.5 py-1 has-checked:bg-secondary has-focus-visible:ring-2 has-focus-visible:ring-ring"
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          {LABELS[option]}
        </label>
      ))}
    </div>
  );
}
