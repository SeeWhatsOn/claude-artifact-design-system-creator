import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { CssVarMap } from "@/core/compile";
import { FAMILY_SLOTS, TEXT_ROLES, type FamilySlot, type RoleOverride, type TextRole } from "@/core/project";
import { TEXT_ROLE_LABELS as ROLE_LABELS } from "@/core/type/role-labels";
import { clearRoleOverride, setRoleOverride } from "@/core/type-editing";
import { useProjectStore } from "@/state/project-store";

const SLOT_LABELS: Record<FamilySlot, string> = { display: "Headings font", body: "Body font", mono: "Code font" };

const CASES: { value: NonNullable<RoleOverride["case"]>; label: string }[] = [
  { value: "none", label: "As typed" },
  { value: "upper", label: "UPPERCASE" },
  { value: "lower", label: "lowercase" },
  { value: "title", label: "Title Case" },
];

/**
 * Fine-tunes one text role. Fields show the compiled values (read from the preview variables);
 * anything changed here becomes an override that survives ratio and base changes.
 * Given `fixedRole` (as in the preview inspector), it edits only that role and hides the role picker.
 */
export function RoleEditor({ vars, fixedRole }: { vars: CssVarMap; fixedRole?: TextRole }) {
  const type = useProjectStore(state => state.project.type);
  const updateProject = useProjectStore(state => state.updateProject);
  const [chosen, setRole] = useState<TextRole>("h1");
  const role = fixedRole ?? chosen;
  const override = type.roleOverrides[role] ?? {};
  const read = (name: string) => Number.parseFloat(vars[`--type-${role}-${name}`] ?? "0");
  const size = read("size");
  const family = override.family ?? familyOf(vars[`--type-${role}-family`], vars);
  const weights = type.families[family].weights;
  const change = (changes: RoleOverride) => updateProject(project => setRoleOverride(project, role, changes));

  return (
    <fieldset className="space-y-3">
      <legend className={fixedRole ? "sr-only" : "mb-2 text-sm font-medium"}>
        {fixedRole ? ROLE_LABELS[fixedRole] : "Adjust a text role"}
      </legend>
      {!fixedRole && (
        <Field label="Text role">
          <select
            value={role}
            onChange={event => setRole(TEXT_ROLES.find(option => option === event.target.value) ?? "h1")}
            className={INPUT}
          >
            {TEXT_ROLES.map(option => (
              <option key={option} value={option}>
                {ROLE_LABELS[option]}
              </option>
            ))}
          </select>
        </Field>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Font">
          <select
            value={family}
            onChange={event => change({ family: FAMILY_SLOTS.find(slot => slot === event.target.value) ?? family })}
            className={INPUT}
          >
            {FAMILY_SLOTS.map(slot => (
              <option key={slot} value={slot}>
                {SLOT_LABELS[slot]} ({type.families[slot].family})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Size (px)">
          <input
            type="number"
            min={8}
            max={160}
            value={size}
            onChange={event => positive(event.target.value, value => change({ size: value }))}
            className={INPUT}
          />
        </Field>
        <Field label="Weight" note={weights.length === 1 ? "This font ships one weight." : undefined}>
          <select
            value={read("weight")}
            disabled={weights.length === 1}
            onChange={event => change({ weight: Number(event.target.value) })}
            className={INPUT}
          >
            {weights.map(weight => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Line height">
          <input
            type="number"
            min={0.8}
            max={3}
            step={0.05}
            value={size > 0 ? Math.round((read("line-height") / size) * 100) / 100 : 1.5}
            onChange={event => positive(event.target.value, value => change({ lineHeight: value }))}
            className={INPUT}
          />
        </Field>
        <Field label="Letter spacing (em)">
          <input
            type="number"
            min={-0.1}
            max={0.3}
            step={0.005}
            value={read("tracking")}
            onChange={event => {
              const value = Number(event.target.value);
              if (Number.isFinite(value)) change({ letterSpacing: value });
            }}
            className={INPUT}
          />
        </Field>
        <Field label="Case">
          <select
            value={override.case ?? "none"}
            onChange={event => change({ case: CASES.find(option => option.value === event.target.value)?.value })}
            className={INPUT}
          >
            {CASES.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {Object.keys(override).length > 0 && (
        <Button variant="ghost" size="sm" onClick={() => updateProject(project => clearRoleOverride(project, role))}>
          Reset {ROLE_LABELS[role]}
        </Button>
      )}
    </fieldset>
  );
}

const INPUT = "w-full rounded-md border bg-background px-2 py-1 text-sm disabled:opacity-50";

function Field({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      {children}
      {note && <span className="text-xs text-muted-foreground">{note}</span>}
    </label>
  );
}

// Calls back only with a usable positive number, so a half-typed field doesn't write zero.
function positive(raw: string, apply: (value: number) => void) {
  const value = Number(raw);
  if (Number.isFinite(value) && value > 0) apply(value);
}

// Which slot a role's compiled font stack belongs to.
function familyOf(stack: string | undefined, vars: CssVarMap): FamilySlot {
  return FAMILY_SLOTS.find(slot => vars[`--font-${slot}`] === stack) ?? "body";
}
