import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** One choice in a segmented control. */
export type SegmentOption<T extends string | number> = { value: T; label: ReactNode; disabled?: boolean };

const LOOKS = {
  // One bordered pill with the chosen segment filled: for short switches like light/dark.
  joined: {
    group: "inline-flex rounded-md border p-0.5 text-sm",
    option: "rounded px-2.5 py-1 has-checked:bg-secondary",
  },
  // Separate bordered chips that wrap: for longer lists of settings.
  chips: {
    group: "flex flex-wrap gap-1 text-sm",
    option: "rounded-md border px-2 py-1 has-checked:border-primary has-checked:bg-accent",
  },
} as const;

/** A named radio group of mutually exclusive options, drawn as buttons. */
export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  look = "chips",
}: {
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  look?: keyof typeof LOOKS;
}) {
  // Each group gets its own radio name, so the same control shown twice (step tab and inspector) stays independent.
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className={LOOKS[look].group}>
      {options.map(option => (
        <label
          key={option.value}
          className={cn(
            "cursor-pointer has-disabled:cursor-not-allowed has-disabled:opacity-50 has-focus-visible:ring-2 has-focus-visible:ring-ring",
            LOOKS[look].option,
          )}
        >
          <input
            type="radio"
            name={name}
            value={String(option.value)}
            checked={option.value === value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
