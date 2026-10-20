import type { Project, RoleOverride, TextRole } from "./project";

/** Sets the body size every role scales from. Role overrides are kept. */
export function setTypeBase(project: Project, base: number): Project {
  return { ...project, type: { ...project.type, base } };
}

/** Sets the scale ratio. Role overrides are kept, so hand-tuned roles stay as they were. */
export function setRatio(project: Project, ratio: number): Project {
  return { ...project, type: { ...project.type, ratio } };
}

/** Merges changes into one role's overrides. */
export function setRoleOverride(project: Project, role: TextRole, changes: RoleOverride): Project {
  const roleOverrides = { ...project.type.roleOverrides, [role]: { ...project.type.roleOverrides[role], ...changes } };
  return { ...project, type: { ...project.type, roleOverrides } };
}

/** Drops every override on one role, so it follows the scale again. */
export function clearRoleOverride(project: Project, role: TextRole): Project {
  const { [role]: _removed, ...roleOverrides } = project.type.roleOverrides;
  return { ...project, type: { ...project.type, roleOverrides } };
}
