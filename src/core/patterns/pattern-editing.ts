import type { Project } from "../project";
import { patternInfo, type PatternId, type PatternState } from "./pattern-catalogue";

/** How Claude may use a pattern in this project: the user's choice, else the catalogue default. */
export function patternState(project: Project, id: PatternId): PatternState {
  return project.patterns[id] ?? patternInfo(id).defaultState;
}

/** Sets a pattern to preferred, allowed or never. */
export function setPatternState(project: Project, id: PatternId, state: PatternState): Project {
  return { ...project, patterns: { ...project.patterns, [id]: state } };
}
