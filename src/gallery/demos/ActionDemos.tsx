import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { CARD, CONTROL, STATUS } from "@/preview/brand-classes";

/** Actions group: every button variant. */
export function ButtonDemo() {
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

/** Surfaces group: a raised card with actions. */
export function CardDemo() {
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

/** Overlays group: a confirm dialog opened from a destructive button. */
export function DialogDemo() {
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
