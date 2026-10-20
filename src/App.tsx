import { useMemo } from "react";
import { ColourOverrides } from "@/colour/ColourOverrides";
import { DarkThemeToggle } from "@/colour/DarkThemeToggle";
import { PalettePicker } from "@/colour/PalettePicker";
import { SeedEditor } from "@/colour/SeedEditor";
import { compile } from "@/core/compile";
import { DiagnosticsPanel } from "@/diagnostics/DiagnosticsPanel";
import { DownloadButton } from "@/export/DownloadButton";
import { useGoogleFonts } from "@/fonts/use-google-fonts";
import { UndoRedoButtons } from "@/history/UndoRedoButtons";
import { PreviewPane } from "@/preview/PreviewPane";
import { ProjectFileButtons } from "@/project-file/ProjectFileButtons";
import { useProjectStore } from "@/state/project-store";
import { PairingPicker } from "@/type/PairingPicker";
import { RoleEditor } from "@/type/RoleEditor";
import { TypeScaleControls } from "@/type/TypeScaleControls";
import "./index.css";

/** The app shell: controls on the left, live preview and checks on the right. */
export function App() {
  const project = useProjectStore(state => state.project);
  const { preview, diagnostics } = useMemo(() => compile(project), [project]);
  const blocked = diagnostics.some(diagnostic => diagnostic.severity === "block");
  useGoogleFonts(preview.fontsToLoad);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <h1 className="text-lg font-semibold">Brandkit for Claude</h1>
        <div className="flex flex-wrap items-center gap-2">
          <UndoRedoButtons />
          <ProjectFileButtons />
          <DownloadButton disabled={blocked} />
        </div>
      </header>
      <main className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-8">
          <section aria-labelledby="step-colour" className="space-y-4">
            <h2 id="step-colour" className="text-base font-semibold">
              Colour
            </h2>
            <PalettePicker />
            <SeedEditor />
            <DarkThemeToggle />
            <ColourOverrides light={preview.light} dark={preview.dark} />
          </section>
          <section aria-labelledby="step-type" className="space-y-4">
            <h2 id="step-type" className="text-base font-semibold">
              Type
            </h2>
            <PairingPicker />
            <TypeScaleControls />
            <RoleEditor vars={preview.light} />
          </section>
        </div>
        <div className="space-y-6">
          <PreviewPane light={preview.light} dark={preview.dark} />
          <DiagnosticsPanel diagnostics={diagnostics} />
        </div>
      </main>
    </div>
  );
}

export default App;
