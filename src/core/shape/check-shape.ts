import type { Diagnostic } from "../compile";
import type { Shape } from "../project";

/** Corners are a required positive choice: without them Claude would use one radius everywhere. */
export function checkShape(shape: Shape): Diagnostic[] {
  if (shape.radii) return [];
  return [
    {
      severity: "block",
      code: "radius-missing",
      message: "Choose corner radii for controls, cards, dialogs and pills.",
      step: "shape",
      path: "shape.radii",
    },
  ];
}
