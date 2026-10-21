import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CONTROL } from "@/preview/brand-classes";

/** Forms group: a labelled text input with help text. */
export function InputDemo() {
  const id = useId();
  return (
    <div className="max-w-xs space-y-[var(--space-2)]">
      <Label htmlFor={id}>Work email</Label>
      <Input id={id} type="email" placeholder="name@company.com" className={CONTROL} />
      <p className="text-sm text-muted-foreground">We'll only use this for receipts.</p>
    </div>
  );
}

/** Forms group: a labelled select. */
export function SelectDemo() {
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

/** Forms group: checkboxes and a switch. */
export function CheckboxDemo() {
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
