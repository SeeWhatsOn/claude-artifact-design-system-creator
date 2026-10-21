import { useId } from "react";
import type { ThemeId } from "@/core/colour/derive-theme";

/** Light/dark radio buttons for a preview; dark is disabled while the project has no dark theme. */
export function PreviewThemeSwitch({
  value,
  onChange,
  darkAvailable,
  label = "Preview theme",
}: {
  value: ThemeId;
  onChange: (theme: ThemeId) => void;
  darkAvailable: boolean;
  label?: string;
}) {
  // Each preview gets its own radio group name, so two previews on one page don't share a selection.
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md border p-0.5 text-sm">
      {(["light", "dark"] as const).map(option => (
        <label
          key={option}
          className="cursor-pointer rounded px-3 py-1 has-checked:bg-secondary has-disabled:cursor-not-allowed has-disabled:opacity-50 has-focus-visible:ring-2 has-focus-visible:ring-ring"
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            disabled={option === "dark" && !darkAvailable}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          {option === "light" ? "Light" : "Dark"}
        </label>
      ))}
    </div>
  );
}
