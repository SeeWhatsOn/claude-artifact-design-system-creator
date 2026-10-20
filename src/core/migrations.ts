// Raw data rather than palettes.ts, which imports project.ts: importing it here would be a cycle.
import palettes from "./data/palettes.json";
import { isRecord } from "./is-record";
import { DEFAULT_SHADOW } from "./shape/default-shape";

type ProjectData = Record<string, unknown>;

/** Upgrades raw project data by one schemaVersion. Keyed by the version it upgrades from. */
const MIGRATIONS: Record<number, (data: ProjectData) => ProjectData> = {
  0: fromV0,
  1: fromV1,
};

/** Upgrades raw project data from `version` to `target`, one step at a time. The result is validated afterwards. */
export function migrate(data: ProjectData, version: number, target: number): ProjectData {
  let current = data;
  for (let from = version; from < target; from++) {
    const step = MIGRATIONS[from];
    if (!step) return current;
    current = { ...step(current), schemaVersion: from + 1 };
  }
  return current;
}

// v0 had `shape.flat: boolean` and didn't record which curated palette the seeds came from.
function fromV0(data: ProjectData): ProjectData {
  const { flat, ...shape } = isRecord(data.shape) ? data.shape : {};
  const palette = isRecord(data.palette) ? data.palette : {};
  const brand = isRecord(palette.seeds) ? palette.seeds.brand : undefined;
  const match = palettes.find(candidate => candidate.seeds.brand.toLowerCase() === String(brand).toLowerCase());
  return {
    ...data,
    shape: { ...shape, elevation: flat === false ? "shadow" : "flat" },
    palette: { ...palette, paletteId: match?.id ?? null },
  };
}

// v1 had `shape.elevation: "shadow" | "flat"` and three border levels; v2 has a shadow builder and hairline or none.
function fromV1(data: ProjectData): ProjectData {
  const { elevation, ...shape } = isRecord(data.shape) ? data.shape : {};
  return {
    ...data,
    shape: {
      ...shape,
      shadow: { ...DEFAULT_SHADOW, enabled: elevation === "shadow" },
      borders: shape.borders === "none" ? "none" : "hairline",
    },
  };
}
