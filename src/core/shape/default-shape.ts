// No imports, so both the default project and the migrations can use these without an import cycle.

/** A quiet, tinted starting shadow for the builder. Not the generic rgba(0,0,0,.1) soft blur. */
export const DEFAULT_SHADOW = {
  enabled: false,
  colour: "#1d1c1a",
  opacity: 0.14,
  x: 0,
  y: 1,
  blur: 3,
  spread: 0,
};

/** Corners that differ by hierarchy, used when a project has none yet. */
export const DEFAULT_RADII = { control: 6, card: 10, dialog: 14, pill: 999 };
