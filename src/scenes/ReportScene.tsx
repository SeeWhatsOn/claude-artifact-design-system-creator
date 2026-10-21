import { CircleAlert } from "lucide-react";
import { BrandChart } from "@/charts/BrandChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SAMPLE_CHART_DATA } from "@/core/charts/chart-svg";
import { roleStyle } from "@/preview/role-style";
import { cn } from "@/lib/utils";
import { CARD } from "@/preview/brand-classes";
import type { SceneProps } from "./scene-props";

const REGIONS = [
  { region: "North", accounts: "412", change: "+8%" },
  { region: "Midlands", accounts: "296", change: "+3%" },
  { region: "South", accounts: "538", change: "−2%" },
];

/** A written report: title block, lead, sections of body text, a figure, a data table and a callout. */
export function ReportScene({ logo }: SceneProps) {
  return (
    <article data-edit="surface" className="mx-auto flex max-w-2xl flex-col gap-[var(--space-4)] p-[var(--space-4)]">
      {logo}
      <header className="flex flex-col gap-[var(--space-2)] border-b border-border pb-[var(--space-4)]">
        <h2 data-edit="heading" data-edit-role="h1" style={roleStyle("h1")} className="m-0">
          Quarterly customer report
        </h2>
        <p style={roleStyle("small")} className="m-0 text-muted-foreground">
          April to June, prepared by the insights team
        </p>
      </header>
      <p style={roleStyle("lead")} className="m-0">
        Customer numbers grew in two of three regions, and support waits fell for the second quarter running.
      </p>
      <h3 data-edit="heading" data-edit-role="h2" style={roleStyle("h2")} className="m-0">
        Where growth came from
      </h3>
      <p style={roleStyle("body")} className="m-0">
        Most new accounts came through referrals from existing customers. The northern team also ran two local events,
        which brought in a small number of larger accounts. Full figures are in{" "}
        <code style={roleStyle("code")}>q2-accounts.csv</code>.
      </p>
      <figure data-edit="card" className={cn(CARD, "m-0 min-w-0 bg-card p-[var(--space-4)] text-card-foreground")}>
        <BrandChart data={SAMPLE_CHART_DATA} title="New accounts by channel, January to April" />
        <figcaption style={roleStyle("caption")} className="mt-[var(--space-2)] text-muted-foreground">
          Figure 1. New accounts by channel.
        </figcaption>
      </figure>
      <h3 data-edit="heading" data-edit-role="h2" style={roleStyle("h2")} className="m-0">
        Accounts by region
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Region</TableHead>
            <TableHead className="text-right">Accounts</TableHead>
            <TableHead className="text-right">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {REGIONS.map(row => (
            <TableRow key={row.region}>
              <TableCell>{row.region}</TableCell>
              <TableCell className="text-right tabular-nums">{row.accounts}</TableCell>
              <TableCell className="text-right tabular-nums">{row.change}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Alert data-edit="card" className="rounded-[var(--radius-card)] border-[length:var(--border-width)]">
        <CircleAlert aria-hidden />
        <AlertTitle>Southern numbers are provisional</AlertTitle>
        <AlertDescription>
          Two large renewals are still being signed. We'll update this report in August.
        </AlertDescription>
      </Alert>
    </article>
  );
}
