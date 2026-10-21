import type { ReactNode } from "react";
import { useShellStore } from "./shell-store";

/**
 * A token name or raw value, shown only in Advanced mode. Keep it outside the control's <label> so the
 * control's accessible name stays the plain-language one.
 */
export function TokenName({ children }: { children: ReactNode }) {
  const advanced = useShellStore(state => state.advanced);
  if (!advanced) return null;
  return <code className="font-mono text-xs text-muted-foreground">{children}</code>;
}
