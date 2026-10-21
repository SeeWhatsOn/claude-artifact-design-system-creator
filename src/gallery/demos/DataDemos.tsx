import { BrandChart } from "@/charts/BrandChart";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SAMPLE_CHART_DATA } from "@/core/charts/chart-svg";
import { cn } from "@/lib/utils";
import { PILL, STATUS } from "@/preview/brand-classes";

const INVOICES = [
  { id: "INV-001", status: "Paid", tone: "success", amount: "£250.00" },
  { id: "INV-002", status: "Due soon", tone: "warning", amount: "£150.00" },
  { id: "INV-003", status: "Overdue", tone: "destructive", amount: "£350.00" },
] as const;

/** Data group: an invoice table with status badges. */
export function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map(invoice => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>
              <Badge className={cn(PILL, STATUS[invoice.tone])}>{invoice.status}</Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Data group: the brand bar chart. */
export function ChartDemo() {
  return <BrandChart data={SAMPLE_CHART_DATA} title="Visitors by source, January to April" />;
}
