import { test, expect } from "bun:test";
import { createDefaultProject } from "./default-project";
import { readProjectFile, writeProjectFile } from "./project-file";

test("save then load round-trips to a byte-identical file", () => {
  const assets = { "font-1": new Uint8Array([0, 1, 2, 250, 255]) };
  const saved = writeProjectFile(createDefaultProject(), assets);
  const loaded = readProjectFile(saved);
  if (!loaded.ok) throw new Error(loaded.error);
  expect(writeProjectFile(loaded.project, loaded.assets)).toBe(saved);
});

test("uploaded fonts and logos travel inside the file", () => {
  const loaded = readProjectFile(writeProjectFile(createDefaultProject(), { "logo-1": new Uint8Array([9, 8, 7]) }));
  expect(loaded.ok && [...(loaded.assets["logo-1"] ?? [])]).toEqual([9, 8, 7]);
});

test("a file that isn't JSON gets a plain-words error", () => {
  expect(readProjectFile("not json")).toEqual({ ok: false, error: "This file isn't a Brandkit project." });
});

test("an invalid project inside the file reports what is wrong", () => {
  const file = JSON.parse(writeProjectFile(createDefaultProject(), {}));
  file.project.palette.seeds.brand = "blue";
  const loaded = readProjectFile(JSON.stringify(file));
  expect(loaded.ok).toBe(false);
  if (!loaded.ok) expect(loaded.error).toContain("palette.seeds.brand");
});
