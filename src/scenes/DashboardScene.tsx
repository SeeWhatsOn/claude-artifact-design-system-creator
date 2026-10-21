import { BrandChart } from "@/charts/BrandChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SAMPLE_CHART_DATA } from "@/core/charts/chart-svg";
import { pickVariant } from "@/core/components/placement";
import { roleStyle } from "@/preview/role-style";
import { cn } from "@/lib/utils";
import { CARD, CONTROL, PILL, STATUS, type SceneProps } from "./scene-styles";

const METRICS = [
  { label: "Active projects", value: "24", note: "3 more than last week" },
  { label: "Tasks done", value: "186", note: "On track for the month" },
  { label: "Overdue", value: "7", note: "Down from 12" },
];

const PROJECTS = [
  { name: "Website refresh", owner: "Priya", status: "On track", tone: "success" },
  { name: "Spring campaign", owner: "Tom", status: "At risk", tone: "warning" },
  { name: "Billing move", owner: "Ana", status: "Blocked", tone: "destructive" },
] as const;

/** An app dashboard: header and toolbar, summary cards, a chart, a project table and a confirm dialog. */
export function DashboardScene({ components, logo }: SceneProps) {
  const toolbar = pickVariant(components, "Button", "toolbar", ["ghost", "outline", "secondary"]);
  const row = pickVariant(components, "Button", "table row", ["ghost", "link", "outline"]);
  const dialogSafe = pickVariant(components, "Button", "dialog", ["ghost", "outline", "secondary"]);

  return (
    <div data-edit="surface" className="@container flex flex-col gap-[var(--space-5)] p-[var(--space-4)]">
      <header className="flex flex-wrap items-center justify-between gap-[var(--space-3)] border-b border-border pb-[var(--space-3)]">
        {logo}
        <div className="flex flex-wrap gap-[var(--space-2)]">
          {toolbar && (
            <Button data-edit="button" variant={toolbar} className={CONTROL}>
              Filter
            </Button>
          )}
          <Button data-edit="button" className={CONTROL}>
            New project
          </Button>
        </div>
      </header>
      <h2 data-edit="heading" style={roleStyle("h2")} className="m-0">
        Weekly overview
      </h2>
      <div className="grid gap-[var(--space-3)] @md:grid-cols-3">
        {METRICS.map(metric => (
          <div
            key={metric.label}
            data-edit="card"
            className={cn(CARD, "bg-card p-[var(--space-4)] text-card-foreground")}
          >
            <p style={roleStyle("label")} className="m-0 text-muted-foreground">
              {metric.label}
            </p>
            <p style={roleStyle("h1")} className="m-0">
              {metric.value}
            </p>
            <p style={roleStyle("small")} className="m-0 text-muted-foreground">
              {metric.note}
            </p>
          </div>
        ))}
      </div>
      <section data-edit="card" className={cn(CARD, "min-w-0 bg-card p-[var(--space-4)] text-card-foreground")}>
        <h3 data-edit="heading" style={roleStyle("h3")} className="m-0 mb-[var(--space-3)]">
          Tasks finished by team
        </h3>
        <BrandChart data={SAMPLE_CHART_DATA} title="Tasks finished by team, January to April" />
      </section>
      <section data-edit="card" className={cn(CARD, "min-w-0 bg-card p-[var(--space-4)] text-card-foreground")}>
        <h3 data-edit="heading" style={roleStyle("h3")} className="m-0 mb-[var(--space-3)]">
          Projects
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              {row && (
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PROJECTS.map(project => (
              <TableRow key={project.name}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.owner}</TableCell>
                <TableCell>
                  <Badge className={cn(PILL, STATUS[project.tone])}>{project.status}</Badge>
                </TableCell>
                {row && (
                  <TableCell className="text-right">
                    <Button data-edit="button" variant={row} size="sm" className={CONTROL}>
                      Open<span className="sr-only"> {project.name}</span>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      {/* A dialog drawn in place (not a real overlay), so the scene shows its corners and shadow at rest. */}
      <div
        data-edit="dialog"
        className="max-w-sm flex flex-col gap-[var(--space-3)] rounded-[var(--radius-dialog)] border-[length:var(--border-width)] bg-card p-[var(--space-4)] text-card-foreground shadow-[var(--shadow-overlay)]"
      >
        <p data-edit="heading" style={roleStyle("h3")} className="m-0">
          Archive Billing move?
        </p>
        <p style={roleStyle("small")} className="m-0 text-muted-foreground">
          It leaves the dashboard but stays in search.
        </p>
        <div className="flex flex-wrap justify-end gap-[var(--space-2)]">
          {dialogSafe && (
            <Button data-edit="button" variant={dialogSafe} size="sm" className={CONTROL}>
              Keep it
            </Button>
          )}
          <Button data-edit="button" size="sm" className={CONTROL}>
            Archive project
          </Button>
        </div>
      </div>
    </div>
  );
}
