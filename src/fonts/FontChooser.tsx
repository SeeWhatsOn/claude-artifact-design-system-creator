import { useState } from "react";
import { FAMILY_SLOTS, type FamilySlot } from "@/core/project";
import { SegmentedControl } from "@/shell/SegmentedControl";
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
      <SegmentedControl
        label="Font to replace"
        options={FAMILY_SLOTS.map(option => ({
          value: option,
          label: `${SLOT_LABELS[option]} (${families[option].family})`,
        }))}
        value={slot}
        onChange={setSlot}
      />
      <FontSearch slot={slot} />
      <FontUpload slot={slot} />
    </fieldset>
  );
}
