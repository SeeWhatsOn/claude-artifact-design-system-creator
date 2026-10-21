import { describe, expect, test } from "bun:test";
import { compile } from "./compile";
import { createDefaultProject } from "./default-project";
import { PALETTES, applyPalette } from "./palettes";
import { PATTERNS } from "./patterns/pattern-catalogue";
import { setPatternState } from "./patterns/pattern-editing";

const DS_CARD_MARKER = /^<!-- @dsCard group="[A-Za-z][A-Za-z ]*" height=\d+ -->$/;

function text(files: Record<string, string | Uint8Array>, path: string): string {
  const contents = files[path];
  if (typeof contents !== "string") throw new Error(`${path} missing`);
  return contents;
}

// Same contract as the component cards: every var() is defined in the file and no colour is written outside a token.
function expectTokensOnly(html: string) {
  const defined = new Set([...html.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(match => match[1]));
  for (const [, name] of html.matchAll(/var\((--[a-z0-9-]+)/g)) expect(defined).toContain(name);
  const withoutTokenValues = html.replace(/--[a-z0-9-]+\s*:[^;]*;/g, "");
  expect(withoutTokenValues).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|oklch\(|hsl\(|font-family:(?!\s*var\()/);
  expect(html).not.toMatch(/<script/i);
}

// Stock palettes Claude falls back to: shadcn's default chart colours (read from the app's own stock theme)
// and the Recharts / d3 defaults that end up in generated charts.
const shadcnCss = await Bun.file(new URL("../../styles/globals.css", import.meta.url)).text();
const SHADCN_CHART = [...shadcnCss.matchAll(/--chart-\d:\s*([^;]+);/g)].map(match => match[1]?.trim() ?? "");
const STOCK_HEXES = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"];

test("the stock shadcn chart colours were found to check against", () => {
  expect(SHADCN_CHART.length).toBeGreaterThanOrEqual(5);
});

describe.each(PALETTES.map(palette => [palette.id]))("%s export", paletteId => {
  const { files } = compile(applyPalette(createDefaultProject(), paletteId));

  test("no stock chart palette leaks into any exported file", () => {
    for (const [path, contents] of Object.entries(files)) {
      if (typeof contents !== "string") continue;
      const lower = contents.toLowerCase();
      for (const colour of [...SHADCN_CHART, ...STOCK_HEXES]) {
        expect({ path, leaked: lower.includes(colour.toLowerCase()) }).toEqual({ path, leaked: false });
      }
    }
  });

  test("every pattern card uses tokens only", () => {
    for (const path of Object.keys(files).filter(name => name.includes("/Patterns-"))) {
      const html = text(files, path);
      expect(html.split("\n")[0]).toMatch(DS_CARD_MARKER);
      expectTokensOnly(html);
    }
  });
});

test("preferred and allowed patterns get a preview card; never patterns don't", () => {
  const { files } = compile(createDefaultProject());
  expect(files["project/components/Patterns-BarChart/preview.html"]).toBeString();
  expect(files["project/components/Patterns-Quote/preview.html"]).toBeString();
  expect(files["project/components/Patterns-DonutChart/preview.html"]).toBeUndefined();
});

test("every pattern has a card when none is banned", () => {
  const project = setPatternState(createDefaultProject(), "donut-chart", "allowed");
  const { files } = compile(project);
  for (const pattern of PATTERNS) {
    expect(files[`project/components/Patterns-${pattern.name}/preview.html`]).toBeString();
  }
});

test("the patterns README lists usage rules, chart rules and a don't-use line for each never pattern", () => {
  const project = setPatternState(createDefaultProject(), "flowchart", "never");
  const readme = text(compile(project).files, "project/components/Patterns/README.md");
  expect(readme.split("\n")[0]).toMatch(/^[A-Z][^#.!?]*[.]$/);
  expect(readme).toContain("Don't use donut charts; use a bar chart instead.");
  expect(readme).toContain("Don't use flowcharts; use numbered steps instead.");
  expect(readme).toContain("Use a table when there are more than four values to compare.");
  expect(readme).toContain("`chart-1` to `chart-5`, in that order");
  // Preferred patterns come before allowed ones, and banned ones have no usage section.
  expect(readme.indexOf("## Preferred")).toBeLessThan(readme.indexOf("## Allowed"));
  expect(readme).not.toContain("[Flowchart]");
});

test("the main README points Claude at the patterns", () => {
  const readme = text(compile(createDefaultProject()).files, "project/README.md");
  expect(readme).toContain("components/Patterns/README.md");
});

test("pattern cards come before the Cover, which stays right before the index", () => {
  const paths = Object.keys(compile(createDefaultProject()).files);
  expect(paths.indexOf("project/components/Patterns-BarChart/preview.html")).toBeLessThan(
    paths.indexOf("project/components/Cover/preview.html"),
  );
  expect(paths.slice(-2)).toEqual(["project/components/Cover/preview.html", "project/design-system.json"]);
});
