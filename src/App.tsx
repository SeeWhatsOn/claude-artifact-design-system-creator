import { useMemo } from "react";
import { compile } from "@/core/compile";
import { DiagnosticsPanel } from "@/diagnostics/DiagnosticsPanel";
import { DownloadButton } from "@/export/DownloadButton";
import { useGoogleFonts } from "@/fonts/use-google-fonts";
import { useUploadedFonts } from "@/fonts/use-uploaded-fonts";
import { UndoRedoButtons } from "@/history/UndoRedoButtons";
import { PreviewPane } from "@/preview/PreviewPane";
import { ProjectFileButtons } from "@/project-file/ProjectFileButtons";
import { AdvancedToggle } from "@/shell/AdvancedToggle";
import { PreviewSheet } from "@/shell/PreviewSheet";
import { ProgressRail } from "@/shell/ProgressRail";
import { StepView } from "@/shell/StepView";
import { useAssetStore } from "@/state/asset-store";
import { useProjectStore } from "@/state/project-store";
import "./index.css";

/** The app shell: steps rail, the current step's controls, and the live preview with checks beside them. */
export function App() {
  const project = useProjectStore(state => state.project);
  const assets = useAssetStore(state => state.assets);
  const { preview, diagnostics } = useMemo(() => compile(project, { assets }), [project, assets]);
  const blocked = diagnostics.some(diagnostic => diagnostic.severity === "block");
  useGoogleFonts(preview.fontsToLoad);
  useUploadedFonts(preview.fontsToLoad, assets);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <h1 className="text-lg font-semibold">Brandkit for Claude</h1>
        <div className="flex flex-wrap items-center gap-2">
          <AdvancedToggle />
          <UndoRedoButtons />
          <ProjectFileButtons />
          <DownloadButton disabled={blocked} />
        </div>
      </header>
      <main className="grid gap-6 p-4 pb-20 lg:pb-4 lg:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1.2fr)]">
        <ProgressRail diagnostics={diagnostics} />
        <StepView preview={preview} diagnostics={diagnostics} />
        <PreviewSheet>
          <PreviewPane light={preview.light} dark={preview.dark} />
          <DiagnosticsPanel diagnostics={diagnostics} />
        </PreviewSheet>
      </main>
    </div>
  );
}

export default App;
