import { useLayoutEffect, useState, type ReactNode } from "react";
import { editTarget, type EditTarget } from "@/core/edit-targets";

type Box = { top: number; left: number; width: number; height: number };
type Found = { target: EditTarget; box: Box };

/** Called when an edit target is chosen, with the overlay button so focus can go back to it later. */
export type OnEdit = (target: EditTarget, opener: HTMLElement) => void;

/**
 * Wraps a scene. In edit mode the scene goes inert and each `data-edit` element gets a focusable overlay button
 * on top of it. Overlays are siblings rather than attributes on the scene's own elements, so a card's edit target
 * never contains its buttons' targets (nested interactive controls) and the scene's controls stop acting.
 */
export function EditableScene({
  editing,
  onEdit,
  children,
}: {
  editing: boolean;
  onEdit: OnEdit;
  children: ReactNode;
}) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [found, setFound] = useState<Found[]>([]);

  useLayoutEffect(() => {
    if (!editing || !root) return;
    const scene = root;
    // Token edits resize things (bigger radius, roomier spacing), so overlays follow any size change.
    const resizes = new ResizeObserver(measure);
    // Rule changes can add or drop elements (a variant switched off), so the list is re-read on any change.
    const mutations = new MutationObserver(measure);

    // Positions are relative to the wrapper, so overlays scroll with the scene.
    function measure() {
      const origin = scene.getBoundingClientRect();
      const elements = [...scene.querySelectorAll<HTMLElement>("[data-edit]")];
      for (const element of elements) resizes.observe(element);
      setFound(
        elements.flatMap(element => {
          const target = editTarget(element.dataset.edit ?? "", element.dataset.editRole);
          if (!target) return [];
          const rect = element.getBoundingClientRect();
          const box = {
            top: rect.top - origin.top,
            left: rect.left - origin.left,
            width: rect.width,
            height: rect.height,
          };
          return [{ target, box }];
        }),
      );
    }

    measure();
    resizes.observe(scene);
    mutations.observe(scene, { childList: true, subtree: true });
    return () => {
      resizes.disconnect();
      mutations.disconnect();
    };
  }, [editing, root]);

  return (
    <div className="relative">
      <div ref={setRoot} inert={editing}>
        {children}
      </div>
      {editing &&
        found.map(({ target, box }, index) => (
          <button
            // Index keys keep the same button for the same element across re-measures, so focus isn't lost.
            key={index}
            type="button"
            aria-label={target.actionLabel}
            onClick={event => onEdit(target, event.currentTarget)}
            style={box}
            className="group absolute cursor-pointer rounded-sm outline-2 -outline-offset-2 outline-ring/40 outline-dashed hover:outline-ring hover:outline-solid focus-visible:outline-ring focus-visible:outline-solid"
          >
            <span
              aria-hidden
              className="absolute top-0 left-0 hidden rounded-br-sm bg-foreground px-1 text-xs text-background group-hover:block group-focus-visible:block"
            >
              {target.title}
            </span>
          </button>
        ))}
    </div>
  );
}
