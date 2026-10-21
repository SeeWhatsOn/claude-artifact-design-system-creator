import type { FileMap } from "../compile";
import { COMPONENT_CSS } from "../components/component-previews";
import { CHART_RULES, PATTERNS, type PatternInfo, type PatternState } from "../patterns/pattern-catalogue";
import { patternState } from "../patterns/pattern-editing";
import { PATTERN_CSS, patternPreviewBody } from "../patterns/pattern-previews";
import type { Project } from "../project";
import { dsCard, type CardVars } from "./ds-card";

/** Where the patterns README sits, for links from the main README. */
export const PATTERNS_README = "components/Patterns/README.md";

// Card groups must be letters and spaces only, and shouldn't share a name with a component group.
const CARD_GROUP: Record<PatternInfo["group"], string> = {
  Data: "Data patterns",
  Diagrams: "Diagram patterns",
  "Text and layout": "Text patterns",
  Navigation: "Navigation patterns",
};

/**
 * Writes a static `components/Patterns-<Name>/preview.html` card for each preferred or allowed pattern, plus
 * `components/Patterns/README.md` with usage rules, the chart rules and a "don't use" line for each banned pattern.
 */
export function claudePatternFiles(project: Project, vars: CardVars): FileMap {
  const files: FileMap = { [`project/${PATTERNS_README}`]: patternsReadme(project) };
  for (const pattern of PATTERNS) {
    if (patternState(project, pattern.id) === "never") continue;
    files[`project/components/Patterns-${pattern.name}/preview.html`] = dsCard(
      {
        group: CARD_GROUP[pattern.group],
        height: pattern.height,
        title: pattern.title,
        css: `${COMPONENT_CSS}\n${PATTERN_CSS}`,
        body: patternPreviewBody(pattern.id),
      },
      vars,
    );
  }
  return files;
}

function patternsReadme(project: Project): string {
  const inState = (state: PatternState) => PATTERNS.filter(pattern => patternState(project, pattern.id) === state);
  const section = (patterns: PatternInfo[]) =>
    patterns.length === 0
      ? "None."
      : patterns
          .map(
            pattern =>
              `- [${pattern.title}](../Patterns-${pattern.name}/preview.html): ${pattern.summary}\n${pattern.rules.map(rule => `  - ${rule}`).join("\n")}`,
          )
          .join("\n");
  const banned = inState("never");
  return `Patterns are the content building blocks of an artifact, such as charts, tables, diagrams and callouts.

# Patterns

Build artifact content from these patterns, styled as in their previews. Reach for preferred patterns first, use allowed ones when they fit better, and never use the banned ones.

## Preferred

${section(inState("preferred"))}

## Allowed

${section(inState("allowed"))}

## Never use

${banned.length === 0 ? "None." : banned.map(pattern => `- Don't use ${plural(pattern)}; use ${pattern.instead} instead.`).join("\n")}

## Chart rules

${CHART_RULES.map(rule => `- ${rule}`).join("\n")}

## Diagrams

- Draw diagrams as inline SVG with token colours. Don't load Mermaid or any diagram script.
`;
}

const PLURALS: Partial<Record<PatternInfo["id"], string>> = {
  "stat-tiles": "stat tiles",
  steps: "steps",
  tabs: "tabs",
  faq: "FAQs",
  "table-of-contents": "tables of contents",
};

// "Donut chart" → "donut charts", for the don't-use lines.
function plural(pattern: PatternInfo): string {
  return PLURALS[pattern.id] ?? `${pattern.title.toLowerCase()}s`;
}
