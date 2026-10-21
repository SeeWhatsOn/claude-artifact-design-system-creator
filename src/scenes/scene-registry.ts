import type { ComponentType } from "react";
import { BasicsScene } from "./BasicsScene";
import { DashboardScene } from "./DashboardScene";
import { LandingScene } from "./LandingScene";
import { ReportScene } from "./ReportScene";
import type { SceneProps } from "./scene-props";
import { SlideScene } from "./SlideScene";

/** One preview tab: a page drawn with the brand's tokens. */
export type SceneEntry = { id: string; label: string; Scene: ComponentType<SceneProps> };

/** The preview's tabs, in order. Basics comes first; the four realistic scenes follow (SPEC "Preview"). */
export const SCENES: readonly SceneEntry[] = [
  { id: "basics", label: "Basics", Scene: BasicsScene },
  { id: "dashboard", label: "Dashboard", Scene: DashboardScene },
  { id: "landing", label: "Landing page", Scene: LandingScene },
  { id: "report", label: "Report", Scene: ReportScene },
  { id: "slide", label: "Slide", Scene: SlideScene },
];
