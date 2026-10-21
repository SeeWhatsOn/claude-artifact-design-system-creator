import { CircleAlert } from "lucide-react";
import { useId, type ReactNode } from "react";
import { BrandChart } from "@/charts/BrandChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SAMPLE_CHART_DATA } from "@/core/charts/chart-svg";
import type { ComponentName } from "@/core/components/component-catalogue";
import { cn } from "@/lib/utils";

// Controls and surfaces read the compiled shape variables, so corners, borders and shadows follow the project.
const CONTROL = "rounded-[var(--radius-control)]";
const CARD = "rounded-[var(--radius-card)] border-[length:var(--border-width)] shadow-[var(--shadow-raised)]";
const PILL = "rounded-[var(--radius-pill)]";
// shadcn dims inactive tabs with a translucent foreground; the brand's muted text is the colour checked for contrast.
const TAB = cn(CONTROL, "text-muted-foreground");
// shadcn's stock destructive badge is white on a tint; the brand pairs each status fill with its own text colour.
const STATUS = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
} as const;

const INVOICES = [
  { id: "INV-001", status: "Paid", tone: "success", amount: "£250.00" },
  { id: "INV-002", status: "Due soon", tone: "warning", amount: "£150.00" },
  { id: "INV-003", status: "Overdue", tone: "destructive", amount: "£350.00" },
] as const;

function ButtonDemo() {
  return (
    <div className="flex flex-wrap gap-[var(--space-2)]">
      <Button className={CONTROL}>Save changes</Button>
      <Button variant="secondary" className={CONTROL}>
        Preview
      </Button>
      <Button variant="outline" className={CONTROL}>
        Export
      </Button>
      <Button variant="ghost" className={CONTROL}>
        Cancel
      </Button>
      <Button variant="destructive" className={cn(CONTROL, STATUS.destructive)}>
        Delete
      </Button>
    </div>
  );
}

function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-[var(--space-2)]">
      <Badge variant="secondary" className={PILL}>
        Draft
      </Badge>
      <Badge className={PILL}>New</Badge>
      <Badge className={cn(PILL, STATUS.success)}>Paid</Badge>
      <Badge className={cn(PILL, STATUS.warning)}>Due soon</Badge>
      <Badge className={cn(PILL, STATUS.destructive)}>Overdue</Badge>
    </div>
  );
}

function CardDemo() {
  return (
    <Card className={cn("max-w-sm", CARD)}>
      <CardHeader>
        <CardTitle>Monthly report</CardTitle>
        <CardDescription>Sent to your team on the first of each month.</CardDescription>
      </CardHeader>
      <CardFooter className="gap-[var(--space-2)]">
        <Button className={CONTROL}>Subscribe</Button>
        <Button variant="ghost" className={CONTROL}>
          Later
        </Button>
      </CardFooter>
    </Card>
  );
}

function InputDemo() {
  const id = useId();
  return (
    <div className="max-w-xs space-y-[var(--space-2)]">
      <Label htmlFor={id}>Work email</Label>
      <Input id={id} type="email" placeholder="name@company.com" className={CONTROL} />
      <p className="text-sm text-muted-foreground">We'll only use this for receipts.</p>
    </div>
  );
}

function SelectDemo() {
  const id = useId();
  return (
    <div className="max-w-xs space-y-[var(--space-2)]">
      <Label id={id}>Plan</Label>
      <Select defaultValue="team">
        <SelectTrigger aria-labelledby={id} className={cn("w-full", CONTROL)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-[var(--radius-control)] shadow-[var(--shadow-overlay)]">
          <SelectItem value="starter">Starter</SelectItem>
          <SelectItem value="team">Team</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function CheckboxDemo() {
  const weekly = useId();
  const archived = useId();
  const notify = useId();
  return (
    <div className="space-y-[var(--space-3)]">
      <div className="flex items-center gap-[var(--space-2)]">
        <Checkbox id={weekly} defaultChecked />
        <Label htmlFor={weekly}>Email me a weekly summary</Label>
      </div>
      <div className="flex items-center gap-[var(--space-2)]">
        <Checkbox id={archived} />
        <Label htmlFor={archived}>Include archived projects</Label>
      </div>
      <div className="flex items-center gap-[var(--space-2)]">
        <Switch id={notify} defaultChecked />
        <Label htmlFor={notify}>Notifications on</Label>
      </div>
    </div>
  );
}

function TabsDemo() {
  return (
    <Tabs defaultValue="overview">
      <TabsList className={CONTROL}>
        <TabsTrigger value="overview" className={TAB}>
          Overview
        </TabsTrigger>
        <TabsTrigger value="activity" className={TAB}>
          Activity
        </TabsTrigger>
        <TabsTrigger value="settings" className={TAB}>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        Your projects at a glance.
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-muted-foreground">
        Everything your team changed this week.
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground">
        Names, members and billing.
      </TabsContent>
    </Tabs>
  );
}

function TableDemo() {
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

// Samples aren't live messages, so they're notes rather than alerts that screen readers would announce.
function AlertDemo() {
  return (
    <div className="space-y-[var(--space-2)]">
      <Alert role="note" className="rounded-[var(--radius-card)]">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>You can add teammates from Settings.</AlertDescription>
      </Alert>
      {/* The danger fill isn't a text colour, so the error shows in the border and icon, with readable text. */}
      <Alert role="note" className="rounded-[var(--radius-card)] border-destructive">
        <CircleAlert className="text-destructive" aria-hidden />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Update your card to keep your plan.</AlertDescription>
      </Alert>
    </div>
  );
}

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className={cn(CONTROL, STATUS.destructive)}>
          Delete report
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[var(--radius-dialog)] border-[length:var(--border-width)] bg-card text-card-foreground shadow-[var(--shadow-overlay)]">
        <DialogHeader>
          <DialogTitle>Delete this report?</DialogTitle>
          <DialogDescription>It will be removed for everyone on your team.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className={CONTROL}>
              Keep it
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" className={cn(CONTROL, STATUS.destructive)}>
              Delete report
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SidebarDemo() {
  const items = ["Dashboard", "Projects", "Reports", "Team", "Settings"];
  return (
    <nav
      aria-label="Sample navigation"
      className="w-52 rounded-[var(--radius-card)] border border-sidebar-border bg-sidebar p-[var(--space-3)] text-sidebar-foreground"
    >
      <p className="px-[var(--space-2)] font-semibold">Acme</p>
      <ul className="mt-[var(--space-2)] space-y-0.5 text-sm">
        {items.map((item, index) => (
          <li key={item}>
            <a
              href="#gallery-sidebar"
              aria-current={index === 0 ? "page" : undefined}
              onClick={event => event.preventDefault()}
              className={cn(
                "block px-[var(--space-2)] py-[var(--space-1)]",
                CONTROL,
                index === 0
                  ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent",
              )}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ChartDemo() {
  return <BrandChart data={SAMPLE_CHART_DATA} title="Visitors by source, January to April" />;
}

/** A live, interactive sample of each of the twelve components, styled by the scoped brand variables. */
export const COMPONENT_DEMOS: Record<ComponentName, () => ReactNode> = {
  Button: ButtonDemo,
  Badge: BadgeDemo,
  Card: CardDemo,
  Input: InputDemo,
  Select: SelectDemo,
  Checkbox: CheckboxDemo,
  Tabs: TabsDemo,
  Table: TableDemo,
  Alert: AlertDemo,
  Dialog: DialogDemo,
  Sidebar: SidebarDemo,
  Chart: ChartDemo,
};
