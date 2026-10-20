import type { Shape, Project } from "./project";
import { DEFAULT_RADII } from "./shape/default-shape";

type Radii = NonNullable<Shape["radii"]>;

function withShape(project: Project, changes: Partial<Shape>): Project {
  return { ...project, shape: { ...project.shape, ...changes } };
}

/** Sets the spacing grid: every step is a multiple of 4px or 8px. */
export function setSpacingBase(project: Project, spacingBase: Shape["spacingBase"]): Project {
  return withShape(project, { spacingBase });
}

/** Sets how tight or roomy the spacing steps are. */
export function setDensity(project: Project, density: Shape["density"]): Project {
  return withShape(project, { density });
}

/** Sets one corner radius. A project with no radii yet starts from the defaults, so the others are filled in. */
export function setRadius(project: Project, key: keyof Radii, value: number): Project {
  return withShape(project, { radii: { ...(project.shape.radii ?? DEFAULT_RADII), [key]: value } });
}

/** Merges changes into the shadow builder, including switching shadows on or off. */
export function setShadow(project: Project, changes: Partial<Shape["shadow"]>): Project {
  const shadow = { ...project.shape.shadow, ...changes };
  return withShape(project, { shadow: { ...shadow, colour: shadow.colour.toLowerCase() } });
}

/** Chooses hairline borders or none. */
export function setBorders(project: Project, borders: Shape["borders"]): Project {
  return withShape(project, { borders });
}
