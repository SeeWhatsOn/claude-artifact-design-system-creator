import "./index.css";

/** The app shell: title bar and main area that later steps fill in. */
export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-semibold">Brandkit for Claude</h1>
      </header>
      <main className="p-4" />
    </div>
  );
}

export default App;
