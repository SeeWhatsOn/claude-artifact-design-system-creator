import type { CSSProperties } from "react";
import type { TextRole } from "@/core/project";

/** Inline styles that read one text role's compiled variables, so preview text follows the type scale. */
export function roleStyle(role: TextRole): CSSProperties {
  return {
    fontFamily: `var(--type-${role}-family)`,
    fontSize: `var(--type-${role}-size)`,
    lineHeight: `var(--type-${role}-line-height)`,
    fontWeight: `var(--type-${role}-weight)`,
    letterSpacing: `var(--type-${role}-tracking)`,
    textTransform: `var(--type-${role}-case)` as CSSProperties["textTransform"],
  };
}
