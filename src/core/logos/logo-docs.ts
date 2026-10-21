import type { Project } from "../project";
import type { BundledLogo } from "./bundled-logos";

/** The asset group logos export into, as `project/assets/<group>/`. */
export const LOGO_GROUP = "Logos";

const THEME_LABEL: Record<BundledLogo["theme"], string> = {
  light: "for the light theme",
  dark: "for the dark theme",
  any: "for every theme",
};

/** The README's Logo rules: where the files are, or, with none, to use plain type and never invent a mark. */
export function logoRules(project: Project, logos: readonly BundledLogo[]): string {
  const { name } = project.meta;
  if (logos.length === 0) {
    const display = project.type.families.display.family;
    return `There is no logo. Write "${name}" in plain type, in ${display}, wherever a logo would go. Never invent a mark, monogram or icon for it.`;
  }
  return `Use the files in \`assets/${LOGO_GROUP}/\` exactly as they are: its README says which file goes on which theme. Never redraw, recolour, stretch or add effects to them, and never invent another mark.`;
}

/** The Logos group's own README: each file, the theme it belongs on, and how to treat it. */
export function logoGroupReadme(project: Project, logos: readonly BundledLogo[]): string {
  const list = logos.map(logo => `- \`${logo.file}\`: ${logo.name}, ${THEME_LABEL[logo.theme]}.`).join("\n");
  return `# Logos

${project.meta.name}'s logo files. Pick the file made for the current theme; a file "for every theme" works on both.

${list}

- Use the files as they are: never redraw, recolour, crop, stretch or add shadows or outlines.
- Give the logo clear space at least its own height on every side.
`;
}

/** The index's `assetGroups` entry for the logos, in the shape the Design System type reads. */
export function logoAssetGroup(logos: readonly BundledLogo[]) {
  return {
    name: LOGO_GROUP,
    tile: "l",
    order: logos.map(logo => logo.file),
    // `blob` is left out: it is the asset-store id Claude gets when it uploads the file on import.
    files: Object.fromEntries(
      logos.map(logo => [logo.file, { name: logo.file, size: logo.bytes.length, type: logo.type }]),
    ),
  };
}
