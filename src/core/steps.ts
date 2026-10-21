/** The guided path, in order. Diagnostics name one of these ids so the UI can link each problem to its step. */
export const STEPS = [
  { id: "start", label: "Start" },
  { id: "colour", label: "Colour" },
  { id: "type", label: "Type" },
  { id: "shape", label: "Shape and space" },
  { id: "logos", label: "Logos" },
  { id: "components", label: "Components and rules" },
  { id: "voice", label: "Voice" },
  { id: "bans", label: "Bans review" },
  { id: "export", label: "Export" },
] as const;

/** One step of the guided path. */
export type StepId = (typeof STEPS)[number]["id"];

/** The plain-language name of a step. */
export function stepLabel(id: StepId): string {
  return STEPS.find(step => step.id === id)?.label ?? id;
}
