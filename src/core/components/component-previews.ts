import { barChartSvg, chartLegendHtml, SAMPLE_CHART_DATA } from "../charts/chart-svg";
import type { ComponentName } from "./component-catalogue";

/**
 * Static CSS for the twelve components, reading only brand tokens. Exported preview cards, pattern cards and any
 * other static page can share it, so the components look the same everywhere.
 */
export const COMPONENT_CSS = `.ds-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
.ds-stack { display: flex; flex-direction: column; gap: var(--space-2); }
.ds-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-1);
  height: 36px; padding: 0 var(--space-4); border: var(--border-width) solid transparent;
  border-radius: var(--radius-control); font: inherit; font-size: var(--type-label-size);
  font-weight: var(--type-label-weight); cursor: pointer;
}
.ds-btn-primary { background: var(--primary); color: var(--primary-foreground); }
.ds-btn-secondary { background: var(--secondary); color: var(--secondary-foreground); }
.ds-btn-outline { background: var(--background); color: var(--foreground); border: 1px solid var(--border); }
.ds-btn-ghost { background: transparent; color: var(--foreground); }
.ds-btn-destructive { background: var(--destructive); color: var(--destructive-foreground); }
.ds-badge {
  display: inline-flex; align-items: center; padding: 2px var(--space-2); border-radius: var(--radius-pill);
  font-size: var(--type-caption-size); line-height: var(--type-caption-line-height); font-weight: 500;
}
.ds-badge-neutral { background: var(--secondary); color: var(--secondary-foreground); }
.ds-badge-primary { background: var(--primary); color: var(--primary-foreground); }
.ds-badge-success { background: var(--success); color: var(--success-foreground); }
.ds-badge-warning { background: var(--warning); color: var(--warning-foreground); }
.ds-badge-destructive { background: var(--destructive); color: var(--destructive-foreground); }
.ds-card {
  background: var(--card); color: var(--card-foreground); border: var(--border-width) solid var(--border);
  border-radius: var(--radius-card); box-shadow: var(--shadow-raised); padding: var(--space-4);
}
.ds-title { margin: 0; font-family: var(--type-h3-family); font-size: var(--type-h3-size); line-height: var(--type-h3-line-height); font-weight: var(--type-h3-weight); }
.ds-muted { margin: 0; color: var(--muted-foreground); font-size: var(--type-small-size); line-height: var(--type-small-line-height); }
.ds-label { font-size: var(--type-label-size); font-weight: var(--type-label-weight); }
.ds-input {
  height: 36px; width: 100%; max-width: 280px; padding: 0 var(--space-3); border: 1px solid var(--input);
  border-radius: var(--radius-control); background: var(--background); color: var(--foreground); font: inherit;
  display: flex; align-items: center; justify-content: space-between;
}
.ds-placeholder { color: var(--muted-foreground); }
.ds-focus { outline: 2px solid var(--ring); outline-offset: 2px; }
.ds-check {
  display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px;
  border: 1px solid var(--primary); border-radius: 4px; background: var(--background); color: var(--primary-foreground);
  font-size: 12px; line-height: 1;
}
.ds-check-on { background: var(--primary); }
.ds-switch { position: relative; width: 36px; height: 20px; border-radius: var(--radius-pill); background: var(--input); }
.ds-switch::after {
  content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
  border-radius: var(--radius-pill); background: var(--background);
}
.ds-switch-on { background: var(--primary); }
.ds-switch-on::after { left: 18px; }
.ds-tabs { display: inline-flex; gap: 2px; padding: 3px; border-radius: var(--radius-control); background: var(--muted); }
.ds-tab { padding: var(--space-1) var(--space-3); border-radius: var(--radius-control); color: var(--muted-foreground); font-size: var(--type-label-size); }
.ds-tab-on { background: var(--background); color: var(--foreground); box-shadow: var(--shadow-raised); }
.ds-table { width: 100%; border-collapse: collapse; font-size: var(--type-small-size); }
.ds-table th { text-align: left; color: var(--muted-foreground); font-weight: 500; }
.ds-table th, .ds-table td { padding: var(--space-2); border-bottom: 1px solid var(--border); }
.ds-num { text-align: right; font-variant-numeric: tabular-nums; }
.ds-alert { border: 1px solid var(--border); border-radius: var(--radius-card); padding: var(--space-3); background: var(--card); }
.ds-alert-destructive { border-color: var(--destructive); color: var(--destructive); }
.ds-alert strong { display: block; font-weight: 600; }
.ds-scrim { padding: var(--space-4); border-radius: var(--radius-card); background: color-mix(in srgb, var(--foreground) 40%, transparent); }
.ds-dialog { max-width: 340px; margin: 0 auto; border-radius: var(--radius-dialog); box-shadow: var(--shadow-overlay); }
.ds-sidebar {
  width: 200px; padding: var(--space-3); background: var(--sidebar); color: var(--sidebar-foreground);
  border-right: 1px solid var(--sidebar-border); border-radius: var(--radius-card);
}
.ds-nav { list-style: none; margin: var(--space-2) 0 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.ds-nav li { padding: var(--space-1) var(--space-2); border-radius: var(--radius-control); font-size: var(--type-small-size); }
.ds-nav .ds-current { background: var(--sidebar-accent); color: var(--sidebar-accent-foreground); font-weight: 600; }`;

const BODIES: Record<ComponentName, string> = {
  Button: `<div class="ds-stack">
  <div class="ds-row">
    <button class="ds-btn ds-btn-primary">Save changes</button>
    <button class="ds-btn ds-btn-secondary">Preview</button>
    <button class="ds-btn ds-btn-outline">Export</button>
  </div>
  <div class="ds-row">
    <button class="ds-btn ds-btn-ghost">Cancel</button>
    <button class="ds-btn ds-btn-destructive">Delete</button>
  </div>
</div>`,
  Badge: `<div class="ds-row">
  <span class="ds-badge ds-badge-neutral">Draft</span>
  <span class="ds-badge ds-badge-primary">New</span>
  <span class="ds-badge ds-badge-success">Paid</span>
  <span class="ds-badge ds-badge-warning">Due soon</span>
  <span class="ds-badge ds-badge-destructive">Overdue</span>
</div>`,
  Card: `<div class="ds-card ds-stack" style="max-width: 320px;">
  <h3 class="ds-title">Monthly report</h3>
  <p class="ds-muted">Sent to your team on the first of each month.</p>
  <div class="ds-row"><button class="ds-btn ds-btn-primary">Subscribe</button><button class="ds-btn ds-btn-ghost">Later</button></div>
</div>`,
  Input: `<div class="ds-stack">
  <label class="ds-label" for="email">Work email</label>
  <div class="ds-input ds-focus" id="email"><span class="ds-placeholder">name@company.com</span></div>
  <p class="ds-muted">We'll only use this for receipts.</p>
</div>`,
  Select: `<div class="ds-stack">
  <span class="ds-label">Plan</span>
  <div class="ds-input"><span>Team</span><span class="ds-placeholder">⌄</span></div>
</div>`,
  Checkbox: `<div class="ds-stack">
  <div class="ds-row"><span class="ds-check ds-check-on">✓</span><span>Email me a weekly summary</span></div>
  <div class="ds-row"><span class="ds-check"></span><span>Include archived projects</span></div>
  <div class="ds-row"><span class="ds-switch ds-switch-on"></span><span>Notifications on</span></div>
</div>`,
  Tabs: `<div class="ds-stack">
  <div class="ds-tabs"><span class="ds-tab ds-tab-on">Overview</span><span class="ds-tab">Activity</span><span class="ds-tab">Settings</span></div>
  <p class="ds-muted">Your projects at a glance.</p>
</div>`,
  Table: `<table class="ds-table">
  <thead><tr><th>Invoice</th><th>Status</th><th class="ds-num">Amount</th></tr></thead>
  <tbody>
    <tr><td>INV-001</td><td><span class="ds-badge ds-badge-success">Paid</span></td><td class="ds-num">£250.00</td></tr>
    <tr><td>INV-002</td><td><span class="ds-badge ds-badge-warning">Due soon</span></td><td class="ds-num">£150.00</td></tr>
    <tr><td>INV-003</td><td><span class="ds-badge ds-badge-destructive">Overdue</span></td><td class="ds-num">£350.00</td></tr>
  </tbody>
</table>`,
  Alert: `<div class="ds-stack">
  <div class="ds-alert"><strong>Heads up</strong><span class="ds-muted">You can add teammates from Settings.</span></div>
  <div class="ds-alert ds-alert-destructive"><strong>Payment failed</strong><span>Update your card to keep your plan.</span></div>
</div>`,
  Dialog: `<div class="ds-scrim">
  <div class="ds-card ds-dialog ds-stack">
    <h3 class="ds-title">Delete this report?</h3>
    <p class="ds-muted">It will be removed for everyone on your team.</p>
    <div class="ds-row" style="justify-content: flex-end;"><button class="ds-btn ds-btn-outline">Keep it</button><button class="ds-btn ds-btn-destructive">Delete report</button></div>
  </div>
</div>`,
  Sidebar: `<nav class="ds-sidebar" aria-label="Main">
  <strong>Acme</strong>
  <ul class="ds-nav">
    <li class="ds-current">Dashboard</li>
    <li>Projects</li>
    <li>Reports</li>
    <li>Team</li>
    <li>Settings</li>
  </ul>
</nav>`,
  Chart: `<div class="ds-card ds-stack">
  <h3 class="ds-title">Visitors by source</h3>
  ${barChartSvg(SAMPLE_CHART_DATA, { title: "Visitors by source, January to April" })}
  ${chartLegendHtml(SAMPLE_CHART_DATA)}
</div>`,
};

/** The static preview markup for one component, using the classes in `COMPONENT_CSS`. */
export function componentPreviewBody(name: ComponentName): string {
  return BODIES[name];
}
