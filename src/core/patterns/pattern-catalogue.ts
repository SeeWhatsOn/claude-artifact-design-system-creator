// No imports from project.ts: the project schema reads PATTERN_IDS from here.

/** Every artifact pattern, by id. The order is the library's order. */
export const PATTERN_IDS = [
  "bar-chart",
  "line-chart",
  "area-chart",
  "donut-chart",
  "sparkline",
  "stat-tiles",
  "data-table",
  "comparison-table",
  "flowchart",
  "timeline",
  "hierarchy",
  "architecture",
  "callout",
  "quote",
  "definition-list",
  "code-block",
  "steps",
  "two-column",
  "faq",
  "tabs",
  "table-of-contents",
  "breadcrumb",
] as const;

/** One artifact pattern, by id. */
export type PatternId = (typeof PATTERN_IDS)[number];

/** How Claude may use a pattern: reach for it first, use it when it fits, or never. */
export const PATTERN_STATES = ["preferred", "allowed", "never"] as const;

/** One of the three pattern choices. */
export type PatternState = (typeof PATTERN_STATES)[number];

/** The four groups the library and the export list patterns under. */
export type PatternGroup = "Data" | "Diagrams" | "Text and layout" | "Navigation";

/** What Claude is told about a pattern: its name, when to use it, and what to use instead when it's banned. */
export type PatternInfo = {
  id: PatternId;
  /** The name people read, e.g. "Bar chart". */
  title: string;
  /** Export folder suffix: `components/Patterns-<name>/`. */
  name: string;
  group: PatternGroup;
  /** Preview card height in px. */
  height: number;
  /** One sentence, ending in a full stop. */
  summary: string;
  rules: string[];
  /** What to use when this pattern is set to never, e.g. "a bar chart". */
  instead: string;
  defaultState: PatternState;
};

/** The chart rules every chart pattern follows, written once for the export and the library. */
export const CHART_RULES = [
  "Colour series with `chart-1` to `chart-5`, in that order. Never more than five series; group the rest as Other.",
  "Light horizontal gridlines in `border` only. No vertical gridlines, no chart borders.",
  "With three series or fewer, label lines and slices directly; use a legend only above three.",
  "Axis labels and numbers use `muted-foreground` at the `caption` size. Numbers have thousands separators (12,400).",
  "Flat fills only: no 3D, gradients, drop shadows or the charting library's default colours.",
];

/** Every pattern's summary, rules and default, in library order. */
export const PATTERNS: readonly PatternInfo[] = [
  {
    id: "bar-chart",
    title: "Bar chart",
    name: "BarChart",
    group: "Data",
    height: 260,
    summary: "Bar charts compare amounts across a few categories.",
    rules: ["Use for comparing categories or a few periods. Start the value axis at zero.", "Up to five series."],
    instead: "a data table",
    defaultState: "preferred",
  },
  {
    id: "line-chart",
    title: "Line chart",
    name: "LineChart",
    group: "Data",
    height: 260,
    summary: "Line charts show how a few values change over time.",
    rules: ["Use for trends over time with six or more points.", "Label each line at its end instead of a legend."],
    instead: "a bar chart",
    defaultState: "preferred",
  },
  {
    id: "area-chart",
    title: "Area chart",
    name: "AreaChart",
    group: "Data",
    height: 240,
    summary: "Area charts show one total changing over time.",
    rules: ["One series only, with a light flat fill under the line.", "Use a line chart to compare series."],
    instead: "a line chart",
    defaultState: "allowed",
  },
  {
    id: "donut-chart",
    title: "Donut chart",
    name: "DonutChart",
    group: "Data",
    height: 240,
    summary: "Donut charts show parts of one whole.",
    rules: ["Three to five slices that add up to 100%.", "Label every slice with its share; no legend."],
    instead: "a bar chart",
    defaultState: "never",
  },
  {
    id: "sparkline",
    title: "Sparkline",
    name: "Sparkline",
    group: "Data",
    height: 140,
    summary: "Sparklines show a trend in a small space, next to the number they explain.",
    rules: ["No axes, gridlines or labels. Always sit beside the current value.", "One line in `chart-1`."],
    instead: "a stat tile with a change badge",
    defaultState: "allowed",
  },
  {
    id: "stat-tiles",
    title: "Stat tiles",
    name: "StatTiles",
    group: "Data",
    height: 160,
    summary: "Stat tiles show a row of three or four key numbers with a label and change.",
    rules: [
      "Numbers use the `h3` style, not a giant display size. Label above in `muted-foreground`.",
      "Show the change as a status badge (`success` up, `destructive` down). No icons or emoji.",
    ],
    instead: "a short data table",
    defaultState: "preferred",
  },
  {
    id: "data-table",
    title: "Data table",
    name: "DataTable",
    group: "Data",
    height: 260,
    summary: "Data tables list records with sortable columns and a totals row.",
    rules: [
      "Use a table when there are more than four values to compare.",
      "Right-align numbers with tabular figures and thousands separators. Totals row in bold.",
    ],
    instead: "a bulleted list",
    defaultState: "preferred",
  },
  {
    id: "comparison-table",
    title: "Comparison table",
    name: "ComparisonTable",
    group: "Data",
    height: 220,
    summary: "Comparison tables set options side by side, feature by feature.",
    rules: ["Options are columns, features are rows. Mark yes and no with words, not emoji."],
    instead: "a two-column compare",
    defaultState: "allowed",
  },
  {
    id: "flowchart",
    title: "Flowchart",
    name: "Flowchart",
    group: "Diagrams",
    height: 200,
    summary: "Flowcharts show the steps and decisions in a process.",
    rules: [
      "Draw inline SVG with token colours: boxes in `card` with a `border` outline, arrows in `muted-foreground`.",
      "Use `primary` for the one start or end node. No Mermaid or diagram scripts.",
    ],
    instead: "numbered steps",
    defaultState: "allowed",
  },
  {
    id: "timeline",
    title: "Timeline",
    name: "Timeline",
    group: "Diagrams",
    height: 180,
    summary: "Timelines put events or phases in date order along one line.",
    rules: ["Inline SVG or HTML. Dots in `primary`, the line in `border`, dates in `muted-foreground`."],
    instead: "numbered steps",
    defaultState: "allowed",
  },
  {
    id: "hierarchy",
    title: "Hierarchy",
    name: "Hierarchy",
    group: "Diagrams",
    height: 220,
    summary: "Hierarchy diagrams show who or what sits under what, such as an org chart.",
    rules: ["Inline SVG. Top node in `primary`, the rest in `card` with a `border` outline. Three levels at most."],
    instead: "a nested list",
    defaultState: "allowed",
  },
  {
    id: "architecture",
    title: "Architecture diagram",
    name: "Architecture",
    group: "Diagrams",
    height: 220,
    summary: "Architecture diagrams show the parts of a system as boxes joined by labelled arrows.",
    rules: ["Inline SVG. Boxes in `card`, groups in `muted`, arrows in `muted-foreground` with short labels."],
    instead: "a definition list of the parts",
    defaultState: "allowed",
  },
  {
    id: "callout",
    title: "Callout",
    name: "Callout",
    group: "Text and layout",
    height: 140,
    summary: "Callouts pull out a note, tip or warning from the text around them.",
    rules: ["One short paragraph on `muted` with a `primary` left edge. At most one per section. No emoji."],
    instead: "a bold lead-in sentence",
    defaultState: "preferred",
  },
  {
    id: "quote",
    title: "Quote",
    name: "Quote",
    group: "Text and layout",
    height: 150,
    summary: "Quotes set a person's words apart, with who said them.",
    rules: ["Use the `lead` style with a `border` left edge and the source in `muted-foreground` below."],
    instead: "plain text with quotation marks",
    defaultState: "allowed",
  },
  {
    id: "definition-list",
    title: "Definition list",
    name: "DefinitionList",
    group: "Text and layout",
    height: 180,
    summary: "Definition lists pair terms with short explanations.",
    rules: ["Terms in the `label` style, definitions in body text, separated by `border` hairlines."],
    instead: "a two-column table",
    defaultState: "allowed",
  },
  {
    id: "code-block",
    title: "Code block",
    name: "CodeBlock",
    group: "Text and layout",
    height: 160,
    summary: "Code blocks show code or commands in the brand's mono font.",
    rules: ["The `code` style on `muted`, corners `radius-card`. No syntax colours beyond the brand's tokens."],
    instead: "inline code",
    defaultState: "allowed",
  },
  {
    id: "steps",
    title: "Steps",
    name: "Steps",
    group: "Text and layout",
    height: 200,
    summary: "Steps walk through a process in numbered order.",
    rules: ["Numbers in small `primary` circles, one short sentence each. Three to seven steps."],
    instead: "a numbered list",
    defaultState: "preferred",
  },
  {
    id: "two-column",
    title: "Two-column compare",
    name: "TwoColumn",
    group: "Text and layout",
    height: 200,
    summary: "Two-column compares set two options or before and after side by side.",
    rules: ["Two `card` panels of equal width that stack on narrow screens. Same headings in both."],
    instead: "a comparison table",
    defaultState: "allowed",
  },
  {
    id: "faq",
    title: "FAQ",
    name: "Faq",
    group: "Text and layout",
    height: 200,
    summary: "FAQs answer common questions in panels that open one at a time.",
    rules: ["Use `details` and `summary` so it works without scripts. Questions in the `label` style."],
    instead: "headings with short answers",
    defaultState: "allowed",
  },
  {
    id: "tabs",
    title: "Tabs",
    name: "Tabs",
    group: "Navigation",
    height: 160,
    summary: "Tabs switch between a few views of the same thing.",
    rules: ["Two to five short labels. The current tab sits on `background` inside a `muted` track."],
    instead: "headings on one page",
    defaultState: "preferred",
  },
  {
    id: "table-of-contents",
    title: "Table of contents",
    name: "TableOfContents",
    group: "Navigation",
    height: 180,
    summary: "A table of contents links to the sections of a long page.",
    rules: ["Use for pages with four or more sections. Current section in `foreground`, the rest muted."],
    instead: "clear section headings",
    defaultState: "allowed",
  },
  {
    id: "breadcrumb",
    title: "Breadcrumb",
    name: "Breadcrumb",
    group: "Navigation",
    height: 100,
    summary: "Breadcrumbs show where a page sits and link back up the path.",
    rules: ["`muted-foreground` links separated by `/`, current page in `foreground`."],
    instead: "a back link",
    defaultState: "allowed",
  },
];

/** Looks up a pattern by id. */
export function patternInfo(id: PatternId): PatternInfo {
  const info = PATTERNS.find(pattern => pattern.id === id);
  if (!info) throw new Error(`Unknown pattern ${id}`);
  return info;
}
