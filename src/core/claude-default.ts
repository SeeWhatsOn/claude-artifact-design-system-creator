import { compile, type CompileOutput } from "./compile";
import { createDefaultProject } from "./default-project";
import type { FontRef, Project } from "./project";

const INTER: FontRef = {
  source: "google",
  family: "Inter",
  weights: [400, 500, 600, 700],
  variable: true,
  category: "sans-serif",
};

// What Claude reaches for with no direction (docs/research/02-generic-claude-look.md): Inter, Tailwind UI's indigo-600 buttons (indigo-500 fails AA with white text)
// on slate greys, one 8px radius everywhere (rounded-lg) and the stock rgba(0,0,0,.1) soft shadow.
// Kept private so it can only be previewed: it is a comparison, never a preset or an export.
function claudeDefaultProject(): Project {
  const base = createDefaultProject();
  return {
    ...base,
    meta: { name: "Claude default", namespace: "claude-default" },
    palette: {
      paletteId: null,
      seeds: {
        brand: "#4f46e5",
        brandForeground: "#ffffff",
        neutralLightBg: "#ffffff",
        neutralDarkBg: "#0f172a",
        neutralHue: { hue: 257, chroma: 0.02 },
        accent: "#a855f7",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      overrides: { light: {}, dark: {} },
    },
    darkEnabled: true,
    type: {
      families: {
        display: INTER,
        body: INTER,
        mono: { source: "google", family: "JetBrains Mono", weights: [400], variable: true, category: "monospace" },
      },
      base: 16,
      ratio: 1.25,
      roleOverrides: {},
    },
    shape: {
      spacingBase: 4,
      density: "comfortable",
      radii: { control: 8, card: 8, dialog: 8, pill: 9999 },
      shadow: { enabled: true, colour: "#000000", opacity: 0.1, x: 0, y: 4, blur: 6, spread: -1 },
      borders: "hairline",
    },
  };
}

// The look never changes, so it is compiled once, on first use.
let cached: CompileOutput["preview"] | undefined;

/** Preview variables for the generic "Claude default" look, shown beside the user's brand for comparison only. */
export function claudeDefaultPreview(): CompileOutput["preview"] {
  cached ??= compile(claudeDefaultProject()).preview;
  return cached;
}
