import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { compile } from "@/core/compile";
import { useProjectStore } from "@/state/project-store";
import { buildZip } from "./build-zip";
import { downloadFile } from "./download-file";

/** Downloads the Claude Design System package as a zip. Disabled while anything blocks export. */
export function DownloadButton({ disabled }: { disabled: boolean }) {
  const project = useProjectStore(state => state.project);

  function download() {
    // Compiled at click time so the export is stamped with the moment it was made.
    const zip = buildZip(compile(project).files);
    downloadFile(`${project.meta.namespace}-design-system.zip`, zip, "application/zip");
  }

  return (
    <Button onClick={download} disabled={disabled}>
      <Download aria-hidden />
      Download Design System
    </Button>
  );
}
