/** Hands the browser a file to save, using a temporary object URL. */
export function downloadFile(name: string, contents: BlobPart, type: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  // Revoke on the next tick so the click has started the download first.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
