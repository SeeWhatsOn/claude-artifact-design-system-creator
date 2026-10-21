import { barChartWithLegendHtml, SAMPLE_CHART_DATA } from "../charts/chart-svg";
import { donutChartSvg, SAMPLE_DONUT_DATA } from "../charts/donut-chart-svg";
import { lineChartSvg, SAMPLE_TREND_DATA, sparklineSvg } from "../charts/line-chart-svg";
import { architectureSvg, flowchartSvg, hierarchySvg, timelineSvg } from "./diagram-svg";
import type { PatternId } from "./pattern-catalogue";

/**
 * Static CSS for the pattern examples, on top of `COMPONENT_CSS`. Reads brand tokens only, so the same markup
 * works in exported cards and in the app's library.
 */
export const PATTERN_CSS = `.pt-title { margin: 0; font-family: var(--type-h3-family); font-size: var(--type-h3-size); line-height: var(--type-h3-line-height); font-weight: var(--type-h3-weight); }
.pt-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: var(--space-3); }
.pt-tile { display: flex; flex-direction: column; gap: var(--space-1); }
.pt-value { font-family: var(--type-h3-family); font-size: var(--type-h3-size); line-height: var(--type-h3-line-height); font-weight: var(--type-h3-weight); font-variant-numeric: tabular-nums; }
.pt-spark { display: flex; align-items: center; gap: var(--space-3); }
.pt-total td { font-weight: 600; border-bottom: 0; }
.pt-sort { color: var(--foreground); }
.pt-callout { margin: 0; padding: var(--space-3) var(--space-4); background: var(--muted); color: var(--foreground); border-left: 3px solid var(--primary); border-radius: var(--radius-control); }
.pt-quote { margin: 0; padding-left: var(--space-4); border-left: 3px solid var(--border); }
.pt-quote p { margin: 0; font-family: var(--type-lead-family); font-size: var(--type-lead-size); line-height: var(--type-lead-line-height); }
.pt-quote footer { margin-top: var(--space-2); color: var(--muted-foreground); font-size: var(--type-small-size); }
.pt-dl { margin: 0; display: grid; grid-template-columns: max-content 1fr; }
.pt-dl dt, .pt-dl dd { margin: 0; padding: var(--space-2) var(--space-3) var(--space-2) 0; border-bottom: 1px solid var(--border); }
.pt-dl dt { font-size: var(--type-label-size); font-weight: var(--type-label-weight); }
.pt-code { margin: 0; padding: var(--space-3) var(--space-4); background: var(--muted); color: var(--foreground); border-radius: var(--radius-card); overflow-x: auto; font-family: var(--type-code-family); font-size: var(--type-code-size); line-height: var(--type-code-line-height); }
.pt-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-3); counter-reset: step; }
.pt-steps li { display: flex; align-items: center; gap: var(--space-3); counter-increment: step; }
.pt-steps li::before {
  content: counter(step); display: inline-flex; align-items: center; justify-content: center; flex: none;
  width: 24px; height: 24px; border-radius: var(--radius-pill); background: var(--primary); color: var(--primary-foreground);
  font-size: var(--type-caption-size); font-weight: 600;
}
.pt-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-3); }
.pt-columns ul { margin: var(--space-2) 0 0; padding-left: var(--space-4); }
.pt-faq details { border-bottom: 1px solid var(--border); padding: var(--space-2) 0; }
.pt-faq summary { cursor: pointer; font-size: var(--type-label-size); font-weight: var(--type-label-weight); }
.pt-faq details p { margin: var(--space-2) 0 0; color: var(--muted-foreground); }
.pt-toc ol { list-style: none; margin: 0; padding: 0 0 0 var(--space-3); border-left: 1px solid var(--border); display: flex; flex-direction: column; gap: var(--space-1); }
.pt-toc a, .pt-crumbs a { color: var(--muted-foreground); text-decoration: none; }
.pt-toc a:hover, .pt-crumbs a:hover { color: var(--foreground); text-decoration: underline; }
.pt-toc [aria-current], .pt-crumbs [aria-current] { color: var(--foreground); font-weight: 600; }
.pt-crumbs ol { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: var(--space-2); font-size: var(--type-small-size); }
.pt-crumbs li + li::before { content: "/"; margin-right: var(--space-2); color: var(--muted-foreground); }
.pt-check { font-weight: 600; }`;

const BODIES: Record<PatternId, string> = {
  "bar-chart": `<figure class="ds-stack" style="margin: 0;">
  <figcaption class="pt-title">Visitors by source</figcaption>
  ${barChartWithLegendHtml(SAMPLE_CHART_DATA, { title: "Bar chart: visitors by source, January to April" })}
</figure>`,
  "line-chart": `<figure class="ds-stack" style="margin: 0;">
  <figcaption class="pt-title">Orders by channel</figcaption>
  ${lineChartSvg(SAMPLE_TREND_DATA, { title: "Line chart: orders by channel, January to June" })}
</figure>`,
  "area-chart": `<figure class="ds-stack" style="margin: 0;">
  <figcaption class="pt-title">Web orders</figcaption>
  ${lineChartSvg({ ...SAMPLE_TREND_DATA, series: SAMPLE_TREND_DATA.series.slice(0, 1) }, { title: "Area chart: web orders, January to June", area: true })}
</figure>`,
  "donut-chart": `<figure class="ds-stack" style="margin: 0;">
  <figcaption class="pt-title">Share of visitors</figcaption>
  ${donutChartSvg(SAMPLE_DONUT_DATA, { title: "Donut chart: share of visitors by source" })}
</figure>`,
  sparkline: `<div class="pt-spark">
  <div class="pt-tile"><span class="ds-muted">Weekly sign-ups</span><span class="pt-value">1,284</span></div>
  ${sparklineSvg([820, 910, 870, 1040, 990, 1180, 1284], { title: "Sign-ups rising over seven weeks" })}
</div>`,
  "stat-tiles": `<div class="pt-tiles">
  <div class="pt-tile"><span class="ds-muted">Revenue</span><span class="pt-value">£48,200</span><span><span class="ds-badge ds-badge-success">+12%</span></span></div>
  <div class="pt-tile"><span class="ds-muted">Orders</span><span class="pt-value">1,940</span><span><span class="ds-badge ds-badge-success">+4%</span></span></div>
  <div class="pt-tile"><span class="ds-muted">Refunds</span><span class="pt-value">38</span><span><span class="ds-badge ds-badge-destructive">+9%</span></span></div>
</div>`,
  "data-table": `<table class="ds-table">
  <thead><tr><th aria-sort="ascending" class="pt-sort">Region ↑</th><th class="ds-num">Orders</th><th class="ds-num">Revenue</th></tr></thead>
  <tbody>
    <tr><td>North</td><td class="ds-num">1,204</td><td class="ds-num">£18,060</td></tr>
    <tr><td>South</td><td class="ds-num">986</td><td class="ds-num">£14,790</td></tr>
    <tr><td>West</td><td class="ds-num">2,310</td><td class="ds-num">£34,650</td></tr>
    <tr class="pt-total"><td>Total</td><td class="ds-num">4,500</td><td class="ds-num">£67,500</td></tr>
  </tbody>
</table>`,
  "comparison-table": `<table class="ds-table">
  <thead><tr><th>Feature</th><th>Starter</th><th>Team</th></tr></thead>
  <tbody>
    <tr><td>Projects</td><td>3</td><td>Unlimited</td></tr>
    <tr><td>Shared workspaces</td><td>No</td><td><span class="pt-check">Yes</span></td></tr>
    <tr><td>Support</td><td>Email</td><td>Priority</td></tr>
  </tbody>
</table>`,
  flowchart: flowchartSvg(),
  timeline: timelineSvg(),
  hierarchy: hierarchySvg(),
  architecture: architectureSvg(),
  callout: `<p class="pt-callout"><strong>Note:</strong> Changes go live for your whole team as soon as you save.</p>`,
  quote: `<blockquote class="pt-quote">
  <p>We shipped the redesign in half the time, because every page already looked like us.</p>
  <footer>Sam Patel, Head of Product</footer>
</blockquote>`,
  "definition-list": `<dl class="pt-dl">
  <dt>Lead time</dt><dd>Days from order to delivery.</dd>
  <dt>Churn</dt><dd>Share of customers who leave in a month.</dd>
  <dt>NPS</dt><dd>How likely customers are to recommend us, from −100 to 100.</dd>
</dl>`,
  "code-block": `<pre class="pt-code"><code>bun install
bun run build
bun run deploy --env production</code></pre>`,
  steps: `<ol class="pt-steps">
  <li>Create a workspace for your team.</li>
  <li>Invite people by email.</li>
  <li>Import your first project.</li>
</ol>`,
  "two-column": `<div class="pt-columns">
  <div class="ds-card"><strong>Before</strong><ul><li>Three tools</li><li>Weekly exports</li></ul></div>
  <div class="ds-card"><strong>After</strong><ul><li>One workspace</li><li>Live dashboards</li></ul></div>
</div>`,
  faq: `<div class="pt-faq">
  <details open><summary>Can I change plans later?</summary><p>Yes, at any time. We'll pro-rate the difference.</p></details>
  <details><summary>Do you offer refunds?</summary><p>Within 30 days of purchase.</p></details>
</div>`,
  tabs: `<div class="ds-stack">
  <div class="ds-tabs"><span class="ds-tab ds-tab-on">Summary</span><span class="ds-tab">Details</span><span class="ds-tab">History</span></div>
  <p class="ds-muted">The headline numbers for this quarter.</p>
</div>`,
  "table-of-contents": `<nav class="pt-toc" aria-label="On this page">
  <ol>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#results" aria-current="location">Results</a></li>
    <li><a href="#method">Method</a></li>
    <li><a href="#next-steps">Next steps</a></li>
  </ol>
</nav>`,
  breadcrumb: `<nav class="pt-crumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="#home">Home</a></li>
    <li><a href="#reports">Reports</a></li>
    <li><span aria-current="page">Q3 summary</span></li>
  </ol>
</nav>`,
};

/** The static example markup for one pattern, using the classes in `COMPONENT_CSS` and `PATTERN_CSS`. */
export function patternPreviewBody(id: PatternId): string {
  return BODIES[id];
}
