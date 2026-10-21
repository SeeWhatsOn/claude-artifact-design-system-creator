import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PILL, STATUS } from "@/preview/brand-classes";

/** Feedback group: neutral and status badges. */
export function BadgeDemo() {
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

// Samples aren't live messages, so they're notes rather than alerts that screen readers would announce.
/** Feedback group: an info note and an error note. */
export function AlertDemo() {
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
