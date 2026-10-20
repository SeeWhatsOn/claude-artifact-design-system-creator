import { test, expect } from "bun:test";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";

test("compile returns empty preview, diagnostics and files for now", () => {
  const output = compile(createDefaultProject());
  expect(output).toEqual({
    preview: { light: {}, fontsToLoad: [] },
    diagnostics: [],
    files: {},
  });
});
