import { expect, test } from "bun:test";
import { claudeDefaultPreview } from "./claude-default";

const preview = claudeDefaultPreview();

test("the Claude default look is set in Inter", () => {
  expect(preview.light["--font-body"]).toStartWith('"Inter"');
  expect(preview.light["--font-display"]).toStartWith('"Inter"');
  expect(preview.fontsToLoad.map(font => font.family)).toEqual(["Inter", "JetBrains Mono"]);
});

test("the Claude default primary is Tailwind UI's indigo-600 button", () => {
  expect(preview.light["--primary"]).toBe("#4f46e5");
});

test("the Claude default uses one radius everywhere and the stock soft shadow", () => {
  const { light } = preview;
  expect([light["--radius-control"], light["--radius-card"], light["--radius-dialog"]]).toEqual(["8px", "8px", "8px"]);
  expect(light["--shadow-raised"]).toContain("rgba(0, 0, 0, 0.1)");
});

test("the Claude default has a dark theme to compare against", () => {
  expect(preview.dark?.["--primary"]).toBeDefined();
});
