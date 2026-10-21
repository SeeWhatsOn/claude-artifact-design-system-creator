import { expect, test } from "bun:test";
import { createDefaultProject } from "./default-project";
import v2Fixture from "./fixtures/project-v2.json";
import { patternState, setPatternState } from "./patterns/pattern-editing";
import { CURRENT_SCHEMA_VERSION, parseProject } from "./project";

test("migrates a schemaVersion 2 project to the current version with default pattern choices", () => {
  const result = parseProject(v2Fixture);
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.project.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  expect(result.project.meta.name).toBe("Version two");
  expect(patternState(result.project, "bar-chart")).toBe("preferred");
  expect(patternState(result.project, "donut-chart")).toBe("never");
  expect(patternState(result.project, "quote")).toBe("allowed");
});

test("out of the box, bar, line, stat tiles, data table, callout, steps and tabs are preferred and donut is never", () => {
  const project = createDefaultProject();
  for (const id of ["bar-chart", "line-chart", "stat-tiles", "data-table", "callout", "steps", "tabs"] as const) {
    expect(patternState(project, id)).toBe("preferred");
  }
  expect(patternState(project, "donut-chart")).toBe("never");
  expect(patternState(project, "flowchart")).toBe("allowed");
});

test("a pattern choice is saved in the project and survives a save/load round trip", () => {
  const project = setPatternState(createDefaultProject(), "donut-chart", "allowed");
  expect(patternState(project, "donut-chart")).toBe("allowed");
  const reloaded = parseProject(JSON.parse(JSON.stringify(project)));
  expect(reloaded.ok && patternState(reloaded.project, "donut-chart")).toBe("allowed");
});

test("rejects a pattern state that isn't preferred, allowed or never", () => {
  const result = parseProject({ ...createDefaultProject(), patterns: { "bar-chart": "sometimes" } });
  expect(result.ok).toBe(false);
});
