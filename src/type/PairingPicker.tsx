import { useId } from "react";
import { applyPairing, currentPairingId, pairingFont, PAIRINGS, type Pairing } from "@/core/font-pairings";
import { fontStack } from "@/core/type/type-scale";
import { useGoogleFonts } from "@/fonts/use-google-fonts";
import { PickerStrip, STRIP_OPTION } from "@/shell/PickerStrip";
import { useProjectStore } from "@/state/project-store";

const BODY_SAMPLE = "Clear words, set well.";

/** Lets the user pick one of the curated font pairings, each shown in its own faces, from a scrolling strip. */
export function PairingPicker() {
  const pairingId = useProjectStore(state => currentPairingId(state.project));
  // The picker can show twice (Type step and preview inspector); each copy needs its own radio group.
  const name = useId();

  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="mb-2 text-sm font-medium">Font pairing</legend>
      <PickerStrip label="Font pairing" selected={pairingId}>
        {PAIRINGS.map(pairing => (
          <PairingOption key={pairing.id} name={name} pairing={pairing} checked={pairing.id === pairingId} />
        ))}
      </PickerStrip>
    </fieldset>
  );
}

function PairingOption({ name, pairing, checked }: { name: string; pairing: Pairing; checked: boolean }) {
  const updateProject = useProjectStore(state => state.updateProject);
  const display = pairingFont(pairing.display);
  const body = pairingFont(pairing.body);
  // Only the characters shown are downloaded, so twenty previews stay light.
  useGoogleFonts([display], pairing.name);
  useGoogleFonts([body], BODY_SAMPLE);

  return (
    <label className={`group ${STRIP_OPTION} w-48 flex-col gap-0.5`}>
      <input
        type="radio"
        name={name}
        value={pairing.id}
        checked={checked}
        onChange={() => updateProject(project => applyPairing(project, pairing.id))}
        className="sr-only"
      />
      <span className="truncate text-lg" style={{ fontFamily: fontStack(display, "display") }}>
        {pairing.name}
      </span>
      {/* Muted grey is too faint on the selected fill, so the sample switches to the fill's own text colour. */}
      <span
        aria-hidden
        className="text-sm text-muted-foreground group-has-checked:text-accent-foreground"
        style={{ fontFamily: fontStack(body, "body") }}
      >
        {BODY_SAMPLE}
      </span>
    </label>
  );
}
