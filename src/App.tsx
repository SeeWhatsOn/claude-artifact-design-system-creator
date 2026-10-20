import { useMemo } from "react";
import { DarkThemeToggle } from "@/colour/DarkThemeToggle";
import { PalettePicker } from "@/colour/PalettePicker";
import { compile } from "@/core/compile";
import { DiagnosticsPanel } from "@/diagnostics/DiagnosticsPanel";
import { DownloadButton } from "@/export/DownloadButton";
import { PreviewPane } from "@/preview/PreviewPane";
import { useProjectStore } from "@/state/project-store";
import "./index.css";

/** The app shell: controls on the left, live preview and checks on the right. */
export function App() {
  const project = useProjectStore(state => state.project);
  const { preview, diagnostics } = useMemo(() => compile(project), [project]);
  const blocked = diagnostics.some(diagnostic => diagnostic.severity === "block");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <h1 className="text-lg font-semibold">Brandkit for Claude</h1>
        <DownloadButton disabled={blocked} />
      </header>
      <main className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <PalettePicker />
          <DarkThemeToggle />
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
