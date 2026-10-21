import { escapeHtml } from "../export/ds-card";
import { chartVar, formatNumber, type ChartData } from "./chart-svg";

/** Monthly totals for the line and area chart examples: three series, so lines are labelled directly. */
export const SAMPLE_TREND_DATA: ChartData = {
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  series: [
    { name: "Web", values: [12400, 13100, 12900, 14800, 15600, 17200] },
    { name: "App", values: [8200, 9100, 10400, 10900, 12300, 13000] },
    { name: "Store", values: [5100, 4800, 5300, 5000, 5600, 5900] },
  ],
};

const TEXT = "font-size: var(--type-caption-size); fill: var(--muted-foreground);";
const LABEL = "font-size: var(--type-caption-size); fill: var(--foreground);";

type ChartOptions = { width?: number; height?: number; title?: string };

/**
 * Draws a line chart as static SVG in the brand's tokens: series stroke `--chart-n` in order, light horizontal
 * gridlines in `--border`, and each line labelled at its end (the chart rules ask for direct labels up to three series).
 * With `area`, the first series gets a light flat fill underneath.
 */
export function lineChartSvg(
  data: ChartData,
  { width = 360, height = 180, title = "Line chart", area = false }: ChartOptions & { area?: boolean } = {},
): string {
  const pad = { top: 10, right: 56, bottom: 24, left: 48 };
  const max = niceMax(Math.max(1, ...data.series.flatMap(series => series.values)));
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const step = plotW / Math.max(1, data.categories.length - 1);
  const x = (i: number) => pad.left + i * step;
  const y = (value: number) => pad.top + plotH - (value / max) * plotH;

  const grid = [0, 0.5, 1].map(f => {
    const gy = y(max * f).toFixed(1);
    return `<line x1="${pad.left}" x2="${width - pad.right}" y1="${gy}" y2="${gy}" style="stroke: var(--border);" /><text x="${pad.left - 6}" y="${gy}" text-anchor="end" dominant-baseline="middle" style="${TEXT}">${formatNumber(max * f)}</text>`;
  });
  const axis = data.categories.map(
    (category, i) =>
      `<text x="${x(i).toFixed(1)}" y="${height - 6}" text-anchor="middle" style="${TEXT}">${escapeHtml(category)}</text>`,
  );
  const lines = data.series.map((series, s) => {
    const points = series.values.map((value, i) => `${x(i).toFixed(1)},${y(value).toFixed(1)}`);
    const last = series.values.length - 1;
    const fill =
      area && s === 0
        ? `<polygon points="${pad.left},${pad.top + plotH} ${points.join(" ")} ${x(last).toFixed(1)},${pad.top + plotH}" style="fill: ${chartVar(s)}; fill-opacity: 0.16;" />`
        : "";
    const label = `<text x="${(x(last) + 6).toFixed(1)}" y="${y(series.values[last] ?? 0).toFixed(1)}" dominant-baseline="middle" style="${LABEL}">${escapeHtml(series.name)}</text>`;
    return `${fill}<polyline points="${points.join(" ")}" style="fill: none; stroke: ${chartVar(s)}; stroke-width: 2; stroke-linejoin: round;"><title>${escapeHtml(series.name)}</title></polyline>${label}`;
  });
  return svg(width, height, title, [...grid, ...axis, ...lines]);
}

/** A tiny trend line with no axes or labels, for next to a number. Strokes `--chart-1`. */
export function sparklineSvg(
  values: number[],
  { width = 120, height = 32, title = "Trend" }: ChartOptions = {},
): string {
  const min = Math.min(...values);
  const range = Math.max(1, Math.max(...values) - min);
  const step = width / Math.max(1, values.length - 1);
  const points = values.map(
    (value, i) => `${(i * step).toFixed(1)},${(height - 2 - ((value - min) / range) * (height - 4)).toFixed(1)}`,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeHtml(title)}"><polyline points="${points.join(" ")}" style="fill: none; stroke: ${chartVar(0)}; stroke-width: 2; stroke-linejoin: round;" /></svg>`;
}

// Rounds the top of the value axis up to a tidy number (20,000 rather than 17,200).
function niceMax(value: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function svg(width: number, height: number, title: string, parts: string[]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${escapeHtml(title)}">${parts.join("")}</svg>`;
}
