/** Start step: what the guided path covers. The full picker flow (#17) replaces this. */
export function StartIntro() {
  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p>Build your brand step by step: colour, type, shape and space, then the rules Claude should follow.</p>
      <p>The preview updates as you go. The steps rail shows anything that still blocks the download.</p>
    </div>
  );
}

/** Stand-in for a step whose controls haven't been built yet. */
export function ComingSoon() {
  return <p className="text-sm text-muted-foreground">Coming soon. You can skip this step for now.</p>;
}
