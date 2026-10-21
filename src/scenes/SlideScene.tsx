import { useEffect, useRef, useState } from "react";
import { roleStyle } from "@/preview/role-style";
import { cn } from "@/lib/utils";
import { CARD, type SceneProps } from "./scene-styles";

// The slide is laid out at a fixed 16:9 size, then scaled to fit, so type keeps its real proportions on any width.
// 640×360 keeps the scaled type legible on a phone (about half size at 360px wide).
const SLIDE_WIDTH = 640;
const SLIDE_HEIGHT = 360;

const POINTS = ["Customers want fewer alerts", "Shared plans cut rework", "Setup must take minutes"];

/** Tracks an element's width so the slide can scale to fill it. */
function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(SLIDE_WIDTH);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => entry && setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

/** A 16:9 presentation slide: title, three findings in cards, and the brand mark in the footer. */
export function SlideScene({ logo }: SceneProps) {
  const { ref, width } = useWidth();
  const scale = width > 0 ? width / SLIDE_WIDTH : 1;

  return (
    <div ref={ref} className="relative aspect-video w-full overflow-hidden">
      <div
        data-edit="surface"
        style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: `scale(${scale})` }}
        className="absolute top-0 left-0 flex origin-top-left flex-col justify-between gap-[var(--space-5)] p-10"
      >
        <h2 data-edit="heading" style={roleStyle("h1")} className="m-0">
          Three things we learned
        </h2>
        <ul className="m-0 grid list-none grid-cols-3 gap-[var(--space-4)] p-0">
          {POINTS.map(point => (
            <li key={point} data-edit="card" className={cn(CARD, "bg-card p-[var(--space-4)] text-card-foreground")}>
              <h3 data-edit="heading" style={roleStyle("h3")} className="m-0">
                {point}
              </h3>
            </li>
          ))}
        </ul>
        <footer className="flex items-center justify-between">
          {logo}
          <span style={roleStyle("caption")} className="text-muted-foreground">
            Research review, June
          </span>
        </footer>
      </div>
    </div>
  );
}
