import { CURRENT_SCHEMA_VERSION, type Project } from "./project";

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
        brand: "#1D6FB5",
        brandForeground: "#FFFFFF",
        neutralLightBg: "#F3F2F1",
        neutralDarkBg: "#1D1C1A",
        neutralHue: { hue: 85, chroma: 0.004 },
        accent: "#FFDD00",
        success: "#00703C",
        warning: "#F47738",
        danger: "#D4351C",
      },
      overrides: { light: {}, dark: {} },
    },
    darkEnabled: true,
    type: {
      // Families from docs/research/05-font-pairings.json ("broadsheet-modern").
      families: {
        display: { source: "google", family: "Brygada 1918", weights: [400, 500, 600, 700], variable: true },
        body: {
          source: "google",
          family: "Schibsted Grotesk",
          weights: [400, 500, 600, 700, 800, 900],
          variable: true,
        },
        mono: { source: "google", family: "Fragment Mono", weights: [400], variable: false },
      },
      base: 16,
      ratio: 1.333,
      roleOverrides: {},
    },
    shape: {
      spacingBase: 4,
      density: "comfortable",
      radii: { control: 6, card: 10, dialog: 14, pill: 999 },
      elevation: "flat",
      borders: "subtle",
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
    logos: [],
    snapshots: [],
  };
}
