import { escapeHtml } from "../escape-html";

/** A box in a diagram: top-left corner, size, label, and whether it's the one highlighted node. */
type DiagramNode = { x: number; y: number; w: number; h: number; label: string; strong?: boolean };

const NODE_H = 36;

// Arrowheads are drawn as polygons rather than <marker>s: markers need ids, and many diagrams share one page.
function arrow(x1: number, y1: number, x2: number, y2: number, label?: string): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  // The tip, then two corners 7px back along the line, each turned 0.45 rad off it.
  const corner = (turn: number) =>
    `${(x2 - 7 * Math.cos(angle + turn)).toFixed(1)},${(y2 - 7 * Math.sin(angle + turn)).toFixed(1)}`;
  const head = `${x2},${y2} ${corner(0.45)} ${corner(-0.45)}`;
  const text = label
    ? `<text x="${((x1 + x2) / 2).toFixed(1)}" y="${((y1 + y2) / 2 - 6).toFixed(1)}" text-anchor="middle" style="font-size: var(--type-caption-size); fill: var(--muted-foreground);">${escapeHtml(label)}</text>`
    : "";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke: var(--muted-foreground); stroke-width: 1.5;" /><polygon points="${head}" style="fill: var(--muted-foreground);" />${text}`;
}

function node({ x, y, w, h, label, strong }: DiagramNode): string {
  const box = strong ? "fill: var(--primary); stroke: var(--primary);" : "fill: var(--card); stroke: var(--border);";
  const ink = strong ? "var(--primary-foreground)" : "var(--card-foreground)";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" style="${box} stroke-width: 1;" /><text x="${x + w / 2}" y="${y + h / 2}" text-anchor="middle" dominant-baseline="middle" style="font-size: var(--type-small-size); fill: ${ink};">${escapeHtml(label)}</text>`;
}

function svg(width: number, height: number, title: string, parts: string[]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" style="max-width: ${width}px;" role="img" aria-label="${escapeHtml(title)}">${parts.join("")}</svg>`;
}

/** A left-to-right flowchart with one decision, as inline SVG in token colours. */
export function flowchartSvg(): string {
  const nodes: DiagramNode[] = [
    { x: 4, y: 52, w: 84, h: NODE_H, label: "Request", strong: true },
    { x: 116, y: 52, w: 92, h: NODE_H, label: "Approved?" },
    { x: 240, y: 8, w: 96, h: NODE_H, label: "Publish" },
    { x: 240, y: 96, w: 96, h: NODE_H, label: "Send back" },
  ];
  return svg(340, 140, "Flowchart: a request is approved and published, or sent back", [
    arrow(88, 70, 114, 70),
    arrow(208, 62, 238, 30, "Yes"),
    arrow(208, 78, 238, 110, "No"),
    ...nodes.map(node),
  ]);
}

/** Four milestones along one line, as inline SVG: dots in `primary`, the line in `border`. */
export function timelineSvg(): string {
  const events = [
    ["Mar", "Kick-off"],
    ["May", "Beta"],
    ["Aug", "Launch"],
    ["Nov", "Review"],
  ];
  const parts = [`<line x1="16" y1="40" x2="324" y2="40" style="stroke: var(--border); stroke-width: 2;" />`];
  events.forEach(([date = "", label = ""], i) => {
    const x = 30 + i * 93;
    parts.push(
      `<circle cx="${x}" cy="40" r="6" style="fill: var(--primary);" />`,
      `<text x="${x}" y="20" text-anchor="middle" style="font-size: var(--type-caption-size); fill: var(--muted-foreground);">${date}</text>`,
      `<text x="${x}" y="66" text-anchor="middle" style="font-size: var(--type-small-size); fill: var(--foreground);">${label}</text>`,
    );
  });
  return svg(340, 80, "Timeline: kick-off in March, beta in May, launch in August, review in November", parts);
}

/** A three-level hierarchy (an org chart), as inline SVG: the top node in `primary`, the rest on `card`. */
export function hierarchySvg(): string {
  const top: DiagramNode = { x: 120, y: 4, w: 100, h: NODE_H, label: "Director", strong: true };
  const middle: DiagramNode[] = [
    { x: 30, y: 72, w: 100, h: NODE_H, label: "Design" },
    { x: 210, y: 72, w: 100, h: NODE_H, label: "Engineering" },
  ];
  const leaves: DiagramNode[] = [
    { x: 4, y: 140, w: 72, h: NODE_H, label: "Research" },
    { x: 84, y: 140, w: 72, h: NODE_H, label: "Product" },
    { x: 184, y: 140, w: 72, h: NODE_H, label: "Web" },
    { x: 264, y: 140, w: 72, h: NODE_H, label: "Platform" },
  ];
  const link = (from: DiagramNode, to: DiagramNode) => {
    const fx = from.x + from.w / 2;
    const tx = to.x + to.w / 2;
    const midY = (from.y + from.h + to.y) / 2;
    return `<path d="M ${fx} ${from.y + from.h} V ${midY} H ${tx} V ${to.y}" style="fill: none; stroke: var(--border); stroke-width: 1.5;" />`;
  };
  return svg(340, 180, "Org chart: a director over design and engineering teams", [
    ...middle.map(child => link(top, child)),
    link(middle[0] ?? top, leaves[0] ?? top),
    link(middle[0] ?? top, leaves[1] ?? top),
    link(middle[1] ?? top, leaves[2] ?? top),
    link(middle[1] ?? top, leaves[3] ?? top),
    ...[top, ...middle, ...leaves].map(node),
  ]);
}

/** Boxes and labelled arrows for a small web system, with a `muted` group around the backend. */
export function architectureSvg(): string {
  return svg(340, 150, "Architecture: the browser calls an API, which reads a database and a cache", [
    `<rect x="132" y="4" width="204" height="142" rx="10" style="fill: var(--muted); stroke: none;" />`,
    `<text x="146" y="22" style="font-size: var(--type-caption-size); fill: var(--muted-foreground);">Backend</text>`,
    arrow(92, 75, 150, 75, "HTTPS"),
    arrow(236, 66, 252, 48),
    arrow(236, 84, 252, 104),
    ...[
      { x: 4, y: 57, w: 88, h: NODE_H, label: "Browser" },
      { x: 150, y: 57, w: 86, h: NODE_H, label: "API" },
      { x: 254, y: 28, w: 74, h: NODE_H, label: "Database" },
      { x: 254, y: 88, w: 74, h: NODE_H, label: "Cache" },
    ].map(node),
  ]);
}
