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
      className={cn("rounded-lg border bg-background text-foreground", dark && "dark", className)}
    >
      <PortalContainerProvider value={element}>{children}</PortalContainerProvider>
    </div>
  );
}
