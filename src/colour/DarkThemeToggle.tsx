import { useProjectStore } from "@/state/project-store";

/** Turns the auto-derived dark theme on or off. Light is always included. */
export function DarkThemeToggle() {
  const darkEnabled = useProjectStore(state => state.project.darkEnabled);
  const updateProject = useProjectStore(state => state.updateProject);

  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={darkEnabled}
        onChange={event => {
          const enabled = event.target.checked;
          updateProject(project => ({ ...project, darkEnabled: enabled }));
        }}
        className="size-4 accent-primary"
      />
      Include a dark theme
    </label>
  );
}
