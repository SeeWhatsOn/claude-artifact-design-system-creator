import { useState } from "react";
import { FAMILY_SLOTS, type FamilySlot } from "@/core/project";
import { useProjectStore } from "@/state/project-store";
import { FontSearch } from "./FontSearch";
import { FontUpload } from "./FontUpload";

const SLOT_LABELS: Record<FamilySlot, string> = { display: "Headings", body: "Body text", mono: "Code" };

/** Replaces one font slot with any Google font (searched by name) or the user's own uploaded files. */
export function FontChooser() {
  const families = useProjectStore(state => state.project.type.families);
  const [slot, setSlot] = useState<FamilySlot>("display");

  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-medium">Choose any font</legend>
      <div role="radiogroup" aria-label="Font to replace" className="flex flex-wrap gap-1 text-sm">
        {FAMILY_SLOTS.map(option => (
          <label
            key={option}
            className="cursor-pointer rounded-md border px-2 py-1 has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-2 has-focus-visible:ring-ring"
          >
            <input
              type="radio"
              name="font-slot"
              checked={option === slot}
              onChange={() => setSlot(option)}
              className="sr-only"
            />
            {SLOT_LABELS[option]} ({families[option].family})
          </label>
        ))}
      </div>
      <FontSearch slot={slot} />
      <FontUpload slot={slot} />
    </fieldset>
  );
}
