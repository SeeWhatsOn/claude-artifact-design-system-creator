import { TEXT_ROLES, type TextRole } from "./project";
import type { StepId } from "./steps";
import { TEXT_ROLE_LABELS } from "./type/role-labels";

/** The kinds of preview element that can be clicked to edit, as tagged with `data-edit` in the scenes. */
export const EDIT_TARGET_IDS = ["surface", "heading", "card", "button", "dialog"] as const;

/** One kind of editable preview element. */
export type EditTargetId = (typeof EDIT_TARGET_IDS)[number];

/** The main controls the inspector can show. The UI maps each id to a control component. */
export type InspectorControl =
  | "radius-control"
  | "radius-card"
  | "radius-dialog"
  | "main-colour"
  | "depth"
  | "spacing"
  | "page-background"
  | "palette"
  | "text-role"
  | "pairing";

/** One block of the inspector: a control, what it is, what else it changes and where its full settings live. */
export type InspectorSection = {
  control: InspectorControl;
  title: string;
  sharedWith: string;
  tokens: readonly string[];
  step: StepId;
};

/** What the inspector shows for one clicked element. */
export type EditTarget = {
  id: EditTargetId;
  /** Short name for the outline label and inspector title. */
  title: string;
  /** Accessible name of the element's edit target in edit mode. */
  actionLabel: string;
  /** The text role being edited, for headings. */
  role?: TextRole;
  sections: readonly InspectorSection[];
};

const RADIUS = "Corner radius";
const SHADOWS = ["--shadow-raised", "--shadow-overlay", "--border-width"];

const depth: InspectorSection = {
  control: "depth",
  title: "Depth and borders",
  sharedWith: "changes all cards, dialogs and menus",
  tokens: SHADOWS,
  step: "shape",
};

const spacing: InspectorSection = {
  control: "spacing",
  title: "Spacing",
  sharedWith: "changes the gaps and padding everywhere",
  tokens: ["--space-1", "--space-6"],
  step: "shape",
};

const pairing: InspectorSection = {
  control: "pairing",
  title: "Font pairing",
  sharedWith: "changes all headings and body text",
  tokens: ["--font-display", "--font-body"],
  step: "type",
};

function isTextRole(value: string | undefined): value is TextRole {
  return TEXT_ROLES.some(role => role === value);
}

function headingTarget(role: TextRole): EditTarget {
  const name = TEXT_ROLE_LABELS[role];
  return {
    id: "heading",
    title: name,
    actionLabel: "Edit heading style",
    role,
    sections: [
      {
        control: "text-role",
        title: `${name} text`,
        sharedWith: `changes every ${name}`,
        tokens: [`--type-${role}-size`, `--type-${role}-weight`, `--type-${role}-family`],
        step: "type",
      },
      pairing,
    ],
  };
}

const TARGETS: Record<Exclude<EditTargetId, "heading">, EditTarget> = {
  surface: {
    id: "surface",
    title: "Page",
    actionLabel: "Edit page background",
    sections: [
      {
        control: "page-background",
        title: "Page background",
        sharedWith: "changes every page, card and grey",
        tokens: ["--background", "--card", "--muted", "--border"],
        step: "colour",
      },
      {
        control: "palette",
        title: "Palette",
        sharedWith: "replaces every colour",
        tokens: ["--background", "--primary", "--accent"],
        step: "colour",
      },
    ],
  },
  card: {
    id: "card",
    title: "Card",
    actionLabel: "Edit card style",
    sections: [
      {
        control: "radius-card",
        title: RADIUS,
        sharedWith: "changes all cards, alerts and panels",
        tokens: ["--radius-card"],
        step: "shape",
      },
      depth,
      spacing,
    ],
  },
  button: {
    id: "button",
    title: "Button",
    actionLabel: "Edit button style",
    sections: [
      {
        control: "radius-control",
        title: RADIUS,
        sharedWith: "changes all buttons and inputs",
        tokens: ["--radius-control"],
        step: "shape",
      },
      {
        control: "main-colour",
        title: "Main colour",
        sharedWith: "changes main buttons, links, focus rings and charts",
        tokens: ["--primary", "--primary-foreground", "--ring", "--chart-1"],
        step: "colour",
      },
    ],
  },
  dialog: {
    id: "dialog",
    title: "Dialog",
    actionLabel: "Edit dialog style",
    sections: [
      {
        control: "radius-dialog",
        title: RADIUS,
        sharedWith: "changes all dialogs and popovers",
        tokens: ["--radius-dialog"],
        step: "shape",
      },
      depth,
    ],
  },
};

const BY_ID = new Map<string, EditTarget>(Object.entries(TARGETS));

/**
 * The inspector for one tagged preview element, or undefined for an unknown tag.
 * Headings pass their text role (from `data-edit-role`); without one they edit Heading 1.
 */
export function editTarget(id: string, role?: string): EditTarget | undefined {
  if (id === "heading") return headingTarget(isTextRole(role) ? role : "h1");
  return BY_ID.get(id);
}

/** The inspector header for a section, e.g. "Corner radius · changes all buttons and inputs". */
export function sectionHeader(section: InspectorSection): string {
  return `${section.title} · ${section.sharedWith}`;
}
