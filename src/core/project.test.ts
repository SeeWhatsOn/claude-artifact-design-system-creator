import { test, expect } from "bun:test";
import { CURRENT_SCHEMA_VERSION, parseProject } from "./project";
import { createDefaultProject } from "./default-project";

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
