import { createContext, useContext } from "react";

// Radix portals render into document.body by default, outside the preview's scoped CSS variables, so a dialog or
// select menu opened in the preview would wear the app's theme. The preview surface provides its own element here,
// and the shadcn overlay components portal into it instead.
const PortalContainerContext = createContext<HTMLElement | null>(null);

/** Provides the element that overlay components (Dialog, Select) portal into. */
export const PortalContainerProvider = PortalContainerContext.Provider;

/** The element overlays should portal into, or null for document.body. */
export function usePortalContainer(): HTMLElement | null {
  return useContext(PortalContainerContext);
}
