import { expect, test } from "bun:test";
import { compile } from "../compile";
import { createDefaultProject } from "../default-project";
import type { Project } from "../project";

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
const SVG = new TextEncoder().encode(`<svg xmlns="http://www.w3.org/2000/svg"/>`);
const assets = { "png-bytes": PNG, "svg-bytes": SVG };

function projectWithLogos(): Project {
  const project = createDefaultProject();
  return {
    ...project,
    logos: [
      { id: "a", name: "Acme Mark", assetId: "png-bytes", theme: "light" },
      { id: "b", name: "Acme Mark", assetId: "svg-bytes", theme: "dark" },
    ],
  };
}

function index(files: Record<string, string | Uint8Array>): { groups: unknown; assetGroups: unknown } {
  return JSON.parse(String(files["project/design-system.json"]));
}

test("with no logo, the README tells Claude to set the name in plain type and never invent a mark", () => {
  const project = createDefaultProject();
  const readme = compile({ ...project, meta: { name: "Acme", namespace: "acme" } }).files["project/README.md"];
  expect(readme).toContain("## Logo");
  expect(readme).toContain(`There is no logo. Write "Acme" in plain type`);
  expect(readme).toContain("Never invent a mark");
});

test("with no logo there is no Logos group", () => {
  const { files } = compile(createDefaultProject());
  expect(index(files)).toMatchObject({ groups: [], assetGroups: {} });
  expect(files["project/assets/Logos/README.md"]).toBeUndefined();
});

test("each logo is exported under assets/Logos/ with a file name made from its name, theme and format", () => {
  const { files } = compile(projectWithLogos(), { assets });
  expect(files["project/assets/Logos/acme-mark-light.png"]).toEqual(PNG);
  expect(files["project/assets/Logos/acme-mark-dark.svg"]).toEqual(SVG);
});

test("the index names each logo in a Logos asset group, in upload order, and stays the last file", () => {
  const { files } = compile(projectWithLogos(), { assets });
  expect(index(files)).toMatchObject({
    groups: ["Logos"],
    assetGroups: {
      Logos: {
        name: "Logos",
        tile: "l",
        order: ["acme-mark-light.png", "acme-mark-dark.svg"],
        files: {
          "acme-mark-light.png": { name: "acme-mark-light.png", size: 12, type: "image/png" },
          "acme-mark-dark.svg": { name: "acme-mark-dark.svg", size: SVG.length, type: "image/svg+xml" },
        },
      },
    },
  });
  expect(Object.keys(files).at(-1)).toBe("project/design-system.json");
});

test("the Logos group has a README saying which file goes on which theme, and the main README points to it", () => {
  const { files } = compile(projectWithLogos(), { assets });
  const groupReadme = files["project/assets/Logos/README.md"];
  expect(groupReadme).toContain("`acme-mark-light.png`: Acme Mark, for the light theme");
  expect(groupReadme).toContain("`acme-mark-dark.svg`: Acme Mark, for the dark theme");
  const readme = files["project/README.md"];
  expect(readme).toContain("assets/Logos/");
  expect(readme).not.toContain("There is no logo");
});

test("two logos that would share a file name get distinct names", () => {
  const project = projectWithLogos();
  const twins = { ...project, logos: project.logos.map(logo => ({ ...logo, theme: "any" as const, assetId: "png-bytes" })) };
  const { files } = compile(twins, { assets });
  expect(Object.keys(files)).toEqual(
    expect.arrayContaining(["project/assets/Logos/acme-mark.png", "project/assets/Logos/acme-mark-2.png"]),
  );
});

test("a logo whose file is missing blocks export and is left out", () => {
  const { files, diagnostics } = compile(projectWithLogos(), { assets: { "png-bytes": PNG } });
  expect(diagnostics).toContainEqual({
    severity: "block",
    code: "logo-file-missing",
    message: "The file for the logo Acme Mark is missing. Upload it again or remove it.",
    step: "logos",
    path: "logos.1",
  });
  expect(files["project/assets/Logos/acme-mark-dark.svg"]).toBeUndefined();
});
