import { test, expect } from "bun:test";
import { createDefaultProject } from "./default-project";
import { PALETTES, applyPalette, findPalette } from "./palettes";

test("ships the 20 curated palettes with unique ids", () => {
  expect(PALETTES).toHaveLength(20);
  expect(new Set(PALETTES.map(palette => palette.id)).size).toBe(20);
});

test("finds a palette by id", () => {
  expect(findPalette("civic-ledger")?.name).toBe("Civic Ledger");
  expect(findPalette("not-a-palette")).toBeUndefined();
});

test("flags the two palettes that knowingly echo a generic tell", () => {
  const flagged = PALETTES.filter(palette => palette.echoesTell).map(palette => palette.id);
  expect(flagged.sort()).toEqual(["hi-vis", "solarized-dusk"]);
});

test("applying a palette swaps the seeds and records the palette id", () => {
  const project = applyPalette(createDefaultProject(), "ledger-ink");
  expect(project.palette.paletteId).toBe("ledger-ink");
  expect(project.palette.seeds.brand).toBe("#0e4d64");
});

test("applying a palette keeps type and shape choices", () => {
  const before = createDefaultProject();
  const after = applyPalette(before, "ledger-ink");
  expect(after.type).toEqual(before.type);
  expect(after.shape).toEqual(before.shape);
});
