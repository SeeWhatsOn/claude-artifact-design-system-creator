import { escapeHtml } from "../escape-html";

/** One chart series: a name and one value per category. */
export type ChartSeries = { name: string; values: number[] };

/** Data for a grouped bar chart. */
export type ChartData = { categories: string[]; series: ChartSeries[] };

/** Sample data shared by the live gallery chart and the exported static chart, so both show the same thing. */
export const SAMPLE_CHART_DATA: ChartData = {
  categories: ["Jan", "Feb", "Mar", "Apr"],
  series: [
    { name: "Direct", values: [42, 55, 61, 70] },
    { name: "Search", values: [30, 38, 35, 48] },
    { name: "Social", values: [18, 26, 32, 29] },
    { name: "Email", values: [12, 15, 21, 24] },
    { name: "Referral", values: [8, 10, 9, 14] },
  ],
};

/** The CSS variable for the nth series (0-based), cycling through `--chart-1`…`--chart-5`. */
export function chartVar(index: number): string {
  return `var(--chart-${(index % 5) + 1})`;
}

/** Size and accessible name shared by every static chart. */
export type ChartOptions = { width?: number; height?: number; title?: string };

/** Inline style for axis text: caption size in the muted text colour. */
export const CHART_TEXT = "font-size: var(--type-caption-size); fill: var(--muted-foreground);";
/** Inline style for direct series labels: caption size in the main text colour. */
export const CHART_LABEL = "font-size: var(--type-caption-size); fill: var(--foreground);";

/**
 * Three light horizontal gridlines (zero, half, top) in `--border`, each with its value right-aligned
 * `gap` px left of the plot.
 */
export function gridlinesSvg({
  values,
  left,
  right,
  y,
  gap,
}: {
  values: { value: number; label: string }[];
  left: number;
  right: number;
  y: (value: number) => number;
  gap: number;
}): string[] {
  return values.map(({ value, label }) => {
    const gy = y(value).toFixed(1);
    return `<line x1="${left}" x2="${right}" y1="${gy}" y2="${gy}" style="stroke: var(--border);" /><text x="${left - gap}" y="${gy}" text-anchor="end" dominant-baseline="middle" style="${CHART_TEXT}">${label}</text>`;
  });
}

/** Wraps chart parts in a responsive SVG named by its title for screen readers. */
export function chartSvg(width: number, height: number, title: string, parts: string[]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${escapeHtml(title)}">${parts.join("")}</svg>`;
}

const PAD = { top: 8, right: 8, bottom: 24, left: 32 };

/**
 * Draws a grouped bar chart as static SVG that reads only the brand's tokens: series fill `--chart-n`,
 * gridlines `--border`, labels `--muted-foreground`. Used where no React runs, such as exported preview cards.
 */
export function barChartSvg(
  data: ChartData,
  { width = 320, height = 160, title = "Chart" }: ChartOptions = {},
): string {
  const max = Math.max(1, ...data.series.flatMap(series => series.values));
  const plotW = width - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;
  const groupW = plotW / Math.max(1, data.categories.length);
  const barW = (groupW * 0.8) / Math.max(1, data.series.length);
  const y = (value: number) => PAD.top + plotH - (value / max) * plotH;

  const grid = gridlinesSvg({
    values: [0, 0.5, 1].map(f => Math.round(max * f)).map(value => ({ value, label: String(value) })),
    left: PAD.left,
    right: width - PAD.right,
    y,
    gap: 4,
  });
  const bars = data.categories.flatMap((category, c) => {
    const x0 = PAD.left + c * groupW + groupW * 0.1;
    const label = `<text x="${(PAD.left + c * groupW + groupW / 2).toFixed(1)}" y="${height - 6}" text-anchor="middle" style="${CHART_TEXT}">${escapeHtml(category)}</text>`;
    const rects = data.series.map((series, s) => {
      const value = series.values[c] ?? 0;
      return `<rect x="${(x0 + s * barW).toFixed(1)}" y="${y(value).toFixed(1)}" width="${Math.max(1, barW - 1).toFixed(1)}" height="${(PAD.top + plotH - y(value)).toFixed(1)}" style="fill: ${chartVar(s)};"><title>${escapeHtml(`${series.name}, ${category}: ${value}`)}</title></rect>`;
    });
    return [...rects, label];
  });
  return chartSvg(width, height, title, [...grid, ...bars]);
}

/** A legend for the same series as `barChartSvg`, as HTML so it wraps. */
export function chartLegendHtml(data: ChartData): string {
  const items = data.series.map(
    (series, s) =>
      `<li style="display: inline-flex; align-items: center; gap: var(--space-1); margin-right: var(--space-3);"><span style="width: 10px; height: 10px; border-radius: var(--radius-pill); background: ${chartVar(s)};"></span>${escapeHtml(series.name)}</li>`,
  );
  return `<ul style="list-style: none; margin: 0; padding: 0; font-size: var(--type-caption-size); color: var(--muted-foreground);">${items.join("")}</ul>`;
}

// Fixed locale so exports are the same on every machine.
const NUMBER_FORMAT = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

/** Formats a chart or table number with thousands separators, e.g. 12400 → "12,400". */
export function formatNumber(value: number): string {
  return NUMBER_FORMAT.format(value);
}
