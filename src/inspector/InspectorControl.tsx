import { PalettePicker } from "@/colour/PalettePicker";
import { GreyTintFields, SeedField } from "@/colour/SeedFields";
import type { CssVarMap } from "@/core/compile";
import type { InspectorControl as ControlId } from "@/core/edit-targets";
import type { TextRole } from "@/core/project";
import { DepthControls } from "@/shape/DepthControls";
import { RadiusField } from "@/shape/RadiusControls";
import { SpacingControls } from "@/shape/SpacingControls";
import { PairingPicker } from "@/type/PairingPicker";
import { RoleEditor } from "@/type/RoleEditor";

/** Draws one inspector control by id, reusing the same controls the steps show. */
export function InspectorControl({ control, role, vars }: { control: ControlId; role?: TextRole; vars: CssVarMap }) {
  switch (control) {
    case "radius-control":
      return <RadiusField radiusKey="control" />;
    case "radius-card":
      return <RadiusField radiusKey="card" />;
    case "radius-dialog":
      return <RadiusField radiusKey="dialog" />;
    case "main-colour":
      return (
        <div className="flex flex-wrap gap-3">
          <SeedField seed="brand" label="Main colour" />
          <SeedField seed="brandForeground" label="Text on main colour" />
        </div>
      );
    case "page-background":
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-3">
            <SeedField seed="neutralLightBg" label="Light page background" />
            <SeedField seed="neutralDarkBg" label="Dark page background" />
          </div>
          <GreyTintFields />
        </div>
      );
    case "palette":
      return <PalettePicker />;
    case "depth":
      return <DepthControls />;
    case "spacing":
      return <SpacingControls />;
    case "text-role":
      return <RoleEditor vars={vars} fixedRole={role} />;
    case "pairing":
      return <PairingPicker />;
  }
}
