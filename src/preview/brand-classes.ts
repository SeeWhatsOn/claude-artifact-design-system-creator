// Previews read only compiled variables: corners, borders and shadows follow the project being shown.
/** Corners for buttons and inputs. */
export const CONTROL = "rounded-[var(--radius-control)]";
/** A raised card: card corners, the border width and the raised shadow. */
export const CARD = "rounded-[var(--radius-card)] border-[length:var(--border-width)] shadow-[var(--shadow-raised)]";
/** Pill corners for badges. */
export const PILL = "rounded-[var(--radius-pill)]";
/** Status badges pair each status fill with its own text colour (shadcn's stock destructive is white on a tint). */
export const STATUS = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
} as const;
