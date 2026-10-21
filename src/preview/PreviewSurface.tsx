import { useState, type CSSProperties, type ReactNode } from "react";
import type { CssVarMap } from "@/core/compile";
import { cn } from "@/lib/utils";
import { PortalContainerProvider } from "./portal-container";

/**
 * A box that wears the brand: the compiled variables are scoped to it, so the app's own chrome keeps its theme.
 * Dialogs and select menus opened inside it portal back into it, so they wear the brand too.
 */
export function PreviewSurface({
  vars,
  dark,
  className,
  children,
}: {
  vars: CssVarMap;
  dark: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setElement}
      data-preview-theme
      style={{ ...(vars as CSSProperties), fontFamily: "var(--font-body)" }}
      className={cn(
        "rounded-lg border bg-background text-foreground",
        // Button words are set in the label text style, as in the exported cards.
        "[&_[data-slot=button]]:text-[length:var(--type-label-size)] [&_[data-slot=button]]:font-[number:var(--type-label-weight)]",
        dark && "dark",
        className,
      )}
    >
      <PortalContainerProvider value={element}>{children}</PortalContainerProvider>
    </div>
  );
}
