import type { ReactNode } from "react";
import type { Project } from "@/core/project";

/** What every scene gets: the component rules to honour and the brand mark for its header. */
export type SceneProps = { components: Project["components"]; logo: ReactNode };
