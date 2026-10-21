import type { ThemeId } from "@/core/colour/derive-theme";
import { SegmentedControl } from "@/shell/SegmentedControl";

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
  return (
    <SegmentedControl
      look="joined"
      label={label}
      value={value}
      onChange={onChange}
      options={[
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark", disabled: !darkAvailable },
      ]}
    />
  );
}
