import type { FileMap } from "../compile";
import { COMPONENTS, type ComponentInfo } from "../components/component-catalogue";
import { COMPONENT_CSS, componentPreviewBody } from "../components/component-previews";
import { dsCard, escapeHtml, type CardVars } from "./ds-card";

const COVER_SWATCHES = ["primary", "accent", "success", "warning", "destructive", "chart-1", "chart-2", "chart-3"];

/**
 * Writes `components/<Comp>/README.md` and `components/<Comp>/preview.html` for all twelve components,
 * then the Cover card last, as the Design System type asks.
 */
export function claudeComponentFiles(brandName: string, vars: CardVars): FileMap {
  const files: FileMap = {};
  for (const component of COMPONENTS) {
    files[`project/components/${component.name}/README.md`] = componentReadme(component);
    files[`project/components/${component.name}/preview.html`] = dsCard(
      {
        group: component.group,
        height: component.height,
        title: component.title,
        css: COMPONENT_CSS,
        body: componentPreviewBody(component.name),
      },
      vars,
    );
  }
  files["project/components/Cover/preview.html"] = coverCard(brandName, vars);
  return files;
}

// The first line is the summary sentence on its own: the Design System page shows the first sentence.
function componentReadme(component: ComponentInfo): string {
  return `${component.summary}

# ${component.title}

## Usage

${component.rules.map(rule => `- ${rule}`).join("\n")}
`;
}

function coverCard(brandName: string, vars: CardVars): string {
  const swatches = COVER_SWATCHES.map(
    name => `<span class="cover-swatch" style="background: var(--${name});" title="${name}"></span>`,
  ).join("");
  return dsCard(
    {
      group: "Overview",
      height: 320,
      title: `${brandName} design system`,
      css: `${COMPONENT_CSS}
.cover { display: flex; flex-direction: column; gap: var(--space-4); padding: var(--space-5); }
.cover-name {
  margin: 0; font-family: var(--type-display-family); font-size: var(--type-display-size);
  line-height: var(--type-display-line-height); font-weight: var(--type-display-weight);
  letter-spacing: var(--type-display-tracking); text-transform: var(--type-display-case);
}
.cover-swatches { display: flex; gap: var(--space-2); }
.cover-swatch { width: 40px; height: 40px; border-radius: var(--radius-card); border: 1px solid var(--border); }`,
      body: `<div class="cover">
  <h1 class="cover-name">${escapeHtml(brandName)}</h1>
  <p class="ds-muted">Design system: colour, type, shape and twelve components.</p>
  <div class="cover-swatches">${swatches}</div>
  <div class="ds-row"><button class="ds-btn ds-btn-primary">Get started</button><button class="ds-btn ds-btn-secondary">Read the guide</button><span class="ds-badge ds-badge-neutral">v1</span></div>
</div>`,
    },
    vars,
  );
}
