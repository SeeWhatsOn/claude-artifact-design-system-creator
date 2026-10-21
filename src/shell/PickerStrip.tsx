import { useEffect, useRef, type ReactNode } from "react";

// Relative so each hidden radio stays inside the strip; otherwise it escapes the scroll clip and widens the page.
/** Classes for one option in a picker strip: a fixed-width card that shows when it is chosen or focused. */
export const STRIP_OPTION =
  "relative flex shrink-0 cursor-pointer snap-start rounded-md border p-2 has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-2 has-focus-visible:ring-ring";

/**
 * A radio group laid out as one horizontally scrolling row, so a long list of choices takes one line.
 * Whenever the choice changes, the strip scrolls so the chosen option is in view.
 */
export function PickerStrip({
  label,
  selected,
  children,
}: {
  label: string;
  selected: string | null;
  children: ReactNode;
}) {
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = strip.current;
    const input = [...(element?.querySelectorAll("input") ?? [])].find(option => option.value === selected);
    const chosen = input?.closest("label");
    if (!element || !chosen) return;
    // Scroll only the strip, never the page: scrollIntoView would also move the window.
    const left = chosen.offsetLeft - element.offsetLeft;
    if (left < element.scrollLeft || left + chosen.offsetWidth > element.scrollLeft + element.clientWidth) {
      element.scrollLeft = left;
    }
  }, [selected]);

  return (
    <div
      ref={strip}
      role="radiogroup"
      aria-label={label}
      className="flex snap-x gap-2 overflow-x-auto overscroll-x-contain pb-2"
    >
      {children}
    </div>
  );
}
