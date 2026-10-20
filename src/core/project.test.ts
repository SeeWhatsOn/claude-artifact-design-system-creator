import { test, expect } from "bun:test";
import { CURRENT_SCHEMA_VERSION, parseProject } from "./project";
import { createDefaultProject } from "./default-project";
import v0Fixture from "./fixtures/project-v0.json";

test("the default project is valid and carries the current schemaVersion", () => {
  const result = parseProject(createDefaultProject());
  expect(result.ok).toBe(true);
  expect(createDefaultProject().schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
});

test("a project survives a JSON save/load round trip unchanged", () => {
  const project = createDefaultProject();
  const result = parseProject(JSON.parse(JSON.stringify(project)));
  expect(result).toEqual({ ok: true, project });
});

test("rejects a bad colour with an error that names the field", () => {
  const project = createDefaultProject();
  const input = { ...project, palette: { ...project.palette, seeds: { ...project.palette.seeds, brand: "blue" } } };
  const result = parseProject(input);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.error).toContain("palette.seeds.brand");
    expect(result.error).toContain("hex colour");
  }
});

test("rejects input that is not a project at all", () => {
  const result = parseProject("hello");
  expect(result).toEqual({ ok: false, error: "This file isn't a Brandkit project." });
});

test("rejects a project saved by a newer version of the app", () => {
  const result = parseProject({ ...createDefaultProject(), schemaVersion: CURRENT_SCHEMA_VERSION + 1 });
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.error).toContain("newer version");
});

test("migrates a schemaVersion 0 project to the current version", () => {
  const result = parseProject(v0Fixture);
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.project.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  expect(result.project.meta.name).toBe("Old brand");
  // v0 had a flat boolean; it now switches the shadow builder off.
  expect(result.project.shape.shadow.enabled).toBe(false);
  // v0 didn't record the palette; seeds matching a curated palette recover it.
  expect(result.project.palette.paletteId).toBe("civic-ledger");
});

test("a migrated v0 project with custom seeds has no palette id", () => {
  const custom = structuredClone(v0Fixture);
  custom.palette.seeds.brand = "#123456";
  const result = parseProject(custom);
  expect(result.ok && result.project.palette.paletteId).toBeNull();
});

test("hex colours are stored lowercase, however they were typed", () => {
  const project = createDefaultProject();
  const result = parseProject({
    ...project,
    palette: {
      ...project.palette,
      seeds: { ...project.palette.seeds, brand: "#ABCDEF" },
      overrides: { light: { card: "#FFEEDD" }, dark: {} },
    },
  });
  expect(result.ok && result.project.palette.seeds.brand).toBe("#abcdef");
  expect(result.ok && result.project.palette.overrides.light.card).toBe("#ffeedd");
});
