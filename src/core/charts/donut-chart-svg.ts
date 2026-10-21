import { escapeHtml } from "../export/ds-card";
import { chartVar } from "./chart-svg";

const LABEL = "font-size: var(--type-caption-size); fill: var(--foreground);";

/** One slice of a donut chart. */
export type DonutSlice = { name: string; value: number };

/** Sample shares for the donut example. */
export const SAMPLE_DONUT_DATA: DonutSlice[] = [
  { name: "Direct", value: 46 },
  { name: "Search", value: 31 },
  { name: "Social", value: 23 },
];

/** A donut chart as static SVG: slices fill `--chart-n` in order, split by `--background` gaps, labelled directly. */
export function donutChartSvg(slices: DonutSlice[], { width = 320, height = 160, title = "Donut chart" } = {}): string {
  const total = Math.max(
    1,
    slices.reduce((sum, slice) => sum + slice.value, 0),
  );
  const r = height / 2 - 8;
  const cx = r + 8;
  const cy = height / 2;
  let angle = -Math.PI / 2;
  const arcs = slices.map((slice, s) => {
    const sweep = (slice.value / total) * Math.PI * 2;
    const end = angle + sweep;
    const path = `M ${point(cx, cy, r, angle)} A ${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${point(cx, cy, r, end)} L ${point(cx, cy, r * 0.6, end)} A ${r * 0.6} ${r * 0.6} 0 ${sweep > Math.PI ? 1 : 0} 0 ${point(cx, cy, r * 0.6, angle)} Z`;
    angle = end;
    return `<path d="${path}" style="fill: ${chartVar(s)}; stroke: var(--background); stroke-width: 2;"><title>${escapeHtml(`${slice.name}: ${slice.value}`)}</title></path>`;
  });
  const labels = slices.map((slice, s) => {
    const ly = cy - ((slices.length - 1) * 22) / 2 + s * 22;
    const lx = cx + r + 24;
    const share = Math.round((slice.value / total) * 100);
    return `<rect x="${lx}" y="${ly - 5}" width="10" height="10" rx="2" style="fill: ${chartVar(s)};" /><text x="${lx + 16}" y="${ly}" dominant-baseline="middle" style="${LABEL}">${escapeHtml(slice.name)} ${share}%</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${escapeHtml(title)}">${[...arcs, ...labels].join("")}</svg>`;
}

function point(cx: number, cy: number, r: number, angle: number): string {
  return `${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`;
}
