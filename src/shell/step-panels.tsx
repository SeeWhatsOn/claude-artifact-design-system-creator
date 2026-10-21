import type { ComponentType } from "react";
import { ColourOverrides } from "@/colour/ColourOverrides";
import { DarkThemeToggle } from "@/colour/DarkThemeToggle";
import { PalettePicker } from "@/colour/PalettePicker";
import { SeedEditor } from "@/colour/SeedEditor";
import type { CompileOutput, Diagnostic } from "@/core/compile";
import type { StepId } from "@/core/steps";
import { FontChooser } from "@/fonts/FontChooser";
import { ComponentGallery } from "@/gallery/ComponentGallery";
import { LogoEditor } from "@/logos/LogoEditor";
import { PatternLibrary } from "@/patterns/PatternLibrary";
import { DepthControls } from "@/shape/DepthControls";
import { RadiusControls } from "@/shape/RadiusControls";
import { SpacingControls } from "@/shape/SpacingControls";
import { PairingPicker } from "@/type/PairingPicker";
import { RoleEditor } from "@/type/RoleEditor";
import { TypeScaleControls } from "@/type/TypeScaleControls";
import { ExportChecklist } from "./ExportChecklist";
import { ComingSoon, StartIntro } from "./PlaceholderPanels";

/** What every step panel receives: the compiled preview and the current diagnostics. */
export type StepPanelProps = { preview: CompileOutput["preview"]; diagnostics: Diagnostic[] };

/** One block of controls shown on a step. */
export type StepPanel = { step: StepId; id: string; Panel: ComponentType<StepPanelProps> };

/**
 * The step registry: which controls appear on which step, top to bottom.
 * To add a feature to a step, add an entry here; the shell layout doesn't need to change.
 */
export const STEP_PANELS: StepPanel[] = [
  { step: "start", id: "start-intro", Panel: StartIntro },
  { step: "colour", id: "palette", Panel: PalettePicker },
  { step: "colour", id: "seeds", Panel: SeedEditor },
  { step: "colour", id: "dark-theme", Panel: DarkThemeToggle },
  { step: "colour", id: "colour-overrides", Panel: ({ preview }) => <ColourOverrides {...preview} /> },
  { step: "type", id: "pairing", Panel: PairingPicker },
  { step: "type", id: "font-chooser", Panel: FontChooser },
  { step: "type", id: "type-scale", Panel: TypeScaleControls },
  { step: "type", id: "role-editor", Panel: ({ preview }) => <RoleEditor vars={preview.light} /> },
  { step: "shape", id: "spacing", Panel: SpacingControls },
  { step: "shape", id: "radius", Panel: RadiusControls },
  { step: "shape", id: "depth", Panel: DepthControls },
  { step: "logos", id: "logo-editor", Panel: LogoEditor },
  {
    step: "components",
    id: "component-gallery",
    Panel: ({ preview }) => <ComponentGallery light={preview.light} dark={preview.dark} />,
  },
  {
    step: "components",
    id: "pattern-library",
    Panel: ({ preview }) => <PatternLibrary light={preview.light} dark={preview.dark} />,
  },
  { step: "voice", id: "voice-coming-soon", Panel: ComingSoon },
  { step: "bans", id: "bans-coming-soon", Panel: ComingSoon },
  { step: "export", id: "export-checklist", Panel: ExportChecklist },
];

/** The panels registered for one step, in order. */
export function panelsFor(step: StepId): StepPanel[] {
  return STEP_PANELS.filter(panel => panel.step === step);
}
