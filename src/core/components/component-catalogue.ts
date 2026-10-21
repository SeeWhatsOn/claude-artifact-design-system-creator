/** The twelve components every brand is shown and exported with. */
export const COMPONENT_NAMES = [
  "Button",
  "Badge",
  "Card",
  "Input",
  "Select",
  "Checkbox",
  "Tabs",
  "Table",
  "Alert",
  "Dialog",
  "Sidebar",
  "Chart",
] as const;

/** One of the twelve components, by its export folder name. */
export type ComponentName = (typeof COMPONENT_NAMES)[number];

/** What Claude is told about a component: where its card sits, a one-sentence summary and usage rules. */
export type ComponentInfo = {
  name: ComponentName;
  /** The name people read, e.g. "Checkbox and switch". */
  title: string;
  /** The Design System page group, e.g. "Actions". */
  group: string;
  /** Preview card height in px. */
  height: number;
  /** One sentence, ending in a full stop: the Design System page shows it as the summary. */
  summary: string;
  rules: string[];
};

/** Every component's summary and rules, in gallery order. */
export const COMPONENTS: readonly ComponentInfo[] = [
  {
    name: "Button",
    title: "Button",
    group: "Actions",
    height: 120,
    summary: "Buttons start actions, with one primary button per view and quieter variants for everything else.",
    rules: [
      "Primary (`primary` fill) is for the one main action in a view. Never put two primary buttons side by side.",
      "Secondary (`secondary` fill) is for other actions; outline sits on busy surfaces; ghost is for toolbars only.",
      "Destructive (`destructive` fill) is only for delete and other actions that can't be undone.",
      "Corners use `radius-control`. Labels are verbs in sentence case: Save changes, not OK.",
    ],
  },
  {
    name: "Badge",
    title: "Badge",
    group: "Feedback",
    height: 88,
    summary: "Badges label status or category in a few words, using pill corners and the status colours.",
    rules: [
      "Use `success`, `warning` and `destructive` only for real status; `secondary` for neutral labels.",
      "One or two words, never a sentence. Corners use `radius-pill`.",
      "Badges aren't buttons: don't make them clickable.",
    ],
  },
  {
    name: "Card",
    title: "Card",
    group: "Surfaces",
    height: 220,
    summary: "Cards group related content on a raised `card` surface with a title, body and optional actions.",
    rules: [
      "Cards sit on `background` and use `card` with `card-foreground` text, `radius-card` corners and `shadow-raised`.",
      "Don't nest cards inside cards; use spacing or a divider instead.",
      "At most one primary button in a card footer.",
    ],
  },
  {
    name: "Input",
    title: "Input",
    group: "Forms",
    height: 140,
    summary: "Inputs take short typed answers and always come with a visible label above them.",
    rules: [
      "Every input has a visible label; placeholders are examples, never the label.",
      "Borders use `input`; focus shows a `ring` outline. Corners use `radius-control`.",
      "Show errors under the field in `destructive` text with words, not colour alone.",
    ],
  },
  {
    name: "Select",
    title: "Select",
    group: "Forms",
    height: 140,
    summary: "Selects pick one option from a short list and look like inputs with a chevron.",
    rules: [
      "Use a select for five to fifteen options; fewer than five read better as radio buttons.",
      "The menu opens on a `popover` surface with `shadow-overlay`.",
      "Always label it, as with inputs.",
    ],
  },
  {
    name: "Checkbox",
    title: "Checkbox and switch",
    group: "Forms",
    height: 120,
    summary: "Checkboxes choose options that apply on submit, and switches turn a setting on or off straight away.",
    rules: [
      "Use a checkbox inside forms; use a switch only when the change takes effect immediately.",
      "Checked state fills with `primary`. Labels sit to the right and are clickable.",
    ],
  },
  {
    name: "Tabs",
    title: "Tabs",
    group: "Navigation",
    height: 140,
    summary: "Tabs switch between related views of the same content without leaving the page.",
    rules: [
      "Two to six tabs with short nouns. The active tab sits on `background` inside a `muted` track.",
      "Don't use tabs for steps in a sequence; use a stepper or separate pages.",
    ],
  },
  {
    name: "Table",
    title: "Table",
    group: "Data",
    height: 220,
    summary: "Tables show rows of records to compare, with a quiet header and hairline row dividers.",
    rules: [
      "Header text is `muted-foreground`; rows are divided by `border` hairlines, never zebra stripes and borders together.",
      "Numbers align right and use tabular figures; text aligns left.",
      "Status columns use badges.",
    ],
  },
  {
    name: "Alert",
    title: "Alert",
    group: "Feedback",
    height: 160,
    summary: "Alerts call out a message that needs attention, with a title, a short explanation and status colour.",
    rules: [
      "Use `destructive` for errors and `warning` for caution; plain alerts use `card` and `border`.",
      "Always say what happened and what to do next. Pair colour with an icon or words.",
    ],
  },
  {
    name: "Dialog",
    title: "Dialog",
    group: "Overlays",
    height: 220,
    summary: "Dialogs interrupt to confirm a decision or collect a short answer before going on.",
    rules: [
      "Use a dialog only when the user must answer before continuing; otherwise show the content inline.",
      "The panel uses `card`, `radius-dialog` corners and `shadow-overlay`, over a dimmed page.",
      "Buttons sit bottom right: the safe choice first, the main action last.",
    ],
  },
  {
    name: "Sidebar",
    title: "Navigation and sidebar",
    group: "Navigation",
    height: 260,
    summary: "The sidebar holds the app's main navigation, with the current page highlighted.",
    rules: [
      "The sidebar uses `sidebar` with `sidebar-foreground` text and a `sidebar-border` edge.",
      "The current page uses `sidebar-accent`; keep to one level of nesting.",
      "Six to eight top-level items at most, each a short noun.",
    ],
  },
  {
    name: "Chart",
    title: "Chart",
    group: "Data",
    height: 240,
    summary: "Charts plot data with the brand's five chart colours, which step in lightness so series stay apart.",
    rules: [
      "Use `chart-1` to `chart-5` in order; never invent extra series colours or use the stock palette.",
      "Gridlines use `border`; axis labels use `muted-foreground` in the caption style.",
      "Label series directly or with a legend; colour is never the only cue.",
    ],
  },
];
