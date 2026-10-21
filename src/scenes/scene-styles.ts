import type { ReactNode } from "react";
import type { Project } from "@/core/project";

/** What every scene gets: the component rules to honour and the brand mark for its header. */
export type SceneProps = { components: Project["components"]; logo: ReactNode };

// Scenes read only compiled variables: corners, borders, shadows and spacing follow the project being shown.
/** Corners for buttons and inputs. */
export const CONTROL = "rounded-[var(--radius-control)]";
/** A raised card: card corners, the border width and the raised shadow. */
export const CARD = "rounded-[var(--radius-card)] border-[length:var(--border-width)] shadow-[var(--shadow-raised)]";
/** Pill corners for badges. */
export const PILL = "rounded-[var(--radius-pill)]";
/** Status badges pair each status fill with its own text colour. */
export const STATUS = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
} as const;
