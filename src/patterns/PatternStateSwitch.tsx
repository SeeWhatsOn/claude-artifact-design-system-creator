import { PATTERN_STATES, type PatternState } from "@/core/patterns/pattern-catalogue";
import { SegmentedControl } from "@/shell/SegmentedControl";

const LABELS: Record<PatternState, string> = { preferred: "Preferred", allowed: "Allowed", never: "Never" };
const OPTIONS = PATTERN_STATES.map(state => ({ value: state, label: LABELS[state] }));

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
  return <SegmentedControl look="joined" label={label} options={OPTIONS} value={value} onChange={onChange} />;
}
