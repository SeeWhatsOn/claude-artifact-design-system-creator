import { CURRENT_SCHEMA_VERSION, type Project } from "./project";
import { DEFAULT_RADII, DEFAULT_SHADOW } from "./shape/default-shape";

/** A complete, valid starting project: the Civic Ledger palette with the Modern Broadsheet pairing. */
export function createDefaultProject(): Project {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    meta: { name: "My brand", namespace: "my-brand" },
    presetId: null,
    palette: {
      // Seeds copied from docs/research/04-default-palettes.json ("civic-ledger").
      paletteId: "civic-ledger",
      seeds: {
        brand: "#1d6fb5",
        brandForeground: "#ffffff",
        neutralLightBg: "#f3f2f1",
        neutralDarkBg: "#1d1c1a",
        neutralHue: { hue: 85, chroma: 0.004 },
        accent: "#ffdd00",
        success: "#00703c",
        warning: "#f47738",
        danger: "#d4351c",
      },
      overrides: { light: {}, dark: {} },
    },
    darkEnabled: true,
    type: {
      // Families from docs/research/05-font-pairings.json ("broadsheet-modern").
      families: {
        display: {
          source: "google",
          family: "Brygada 1918",
          weights: [400, 500, 600, 700],
          variable: true,
          category: "serif",
        },
        body: {
          source: "google",
          family: "Schibsted Grotesk",
          weights: [400, 500, 600, 700, 800, 900],
          variable: true,
          category: "sans-serif",
        },
        mono: { source: "google", family: "Fragment Mono", weights: [400], variable: false, category: "monospace" },
      },
      base: 16,
      ratio: 1.333,
      roleOverrides: {},
    },
    shape: {
      spacingBase: 4,
      density: "comfortable",
      radii: { ...DEFAULT_RADII },
      shadow: { ...DEFAULT_SHADOW },
      borders: "hairline",
    },
    motion: { policy: "subtle", bannedEffects: [] },
    icons: { stroke: 1.5, size: 20 },
    components: {},
    voice: {
      case: "sentence",
      buttonExamples: [],
      bannedPhrases: [],
      tone: { formality: 0.5, warmth: 0.5 },
      emoji: "never",
    },
    bans: {},
    patterns: {},
    logos: [],
    snapshots: [],
  };
}
