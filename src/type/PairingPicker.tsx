import { applyPairing, currentPairingId, pairingFont, PAIRINGS, type Pairing } from "@/core/font-pairings";
import { fontStack } from "@/core/type/type-scale";
import { useGoogleFonts } from "@/fonts/use-google-fonts";
import { useProjectStore } from "@/state/project-store";

const BODY_SAMPLE = "Clear words, set well.";

/** Lets the user pick one of the curated font pairings, each shown in its own faces. */
export function PairingPicker() {
  const pairingId = useProjectStore(state => currentPairingId(state.project));

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium">Font pairing</legend>
      <div role="radiogroup" aria-label="Font pairing" className="grid gap-2 sm:grid-cols-2">
        {PAIRINGS.map(pairing => (
          <PairingOption key={pairing.id} pairing={pairing} checked={pairing.id === pairingId} />
        ))}
      </div>
    </fieldset>
  );
}

function PairingOption({ pairing, checked }: { pairing: Pairing; checked: boolean }) {
  const updateProject = useProjectStore(state => state.updateProject);
  const display = pairingFont(pairing.display);
  const body = pairingFont(pairing.body);
  // Only the characters shown are downloaded, so twenty previews stay light.
  useGoogleFonts([display], pairing.name);
  useGoogleFonts([body], BODY_SAMPLE);

  return (
    <label className="flex cursor-pointer flex-col gap-0.5 rounded-md border p-2 has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-2 has-focus-visible:ring-ring">
      <input
        type="radio"
        name="font-pairing"
        value={pairing.id}
        checked={checked}
        onChange={() => updateProject(project => applyPairing(project, pairing.id))}
        className="sr-only"
      />
      <span className="text-lg" style={{ fontFamily: fontStack(display, "display") }}>
        {pairing.name}
      </span>
      <span aria-hidden className="text-sm text-muted-foreground" style={{ fontFamily: fontStack(body, "body") }}>
        {BODY_SAMPLE}
      </span>
    </label>
  );
}
