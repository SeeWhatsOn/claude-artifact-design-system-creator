import { useShellStore } from "./shell-store";

/** Header switch for technical users: reveals token names and raw values beside the plain labels. */
export function AdvancedToggle() {
  const advanced = useShellStore(state => state.advanced);
  const setAdvanced = useShellStore(state => state.setAdvanced);

  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        aria-label="Advanced: show token names"
        checked={advanced}
        onChange={event => setAdvanced(event.target.checked)}
        className="size-4 accent-primary"
      />
      Advanced
    </label>
  );
}
