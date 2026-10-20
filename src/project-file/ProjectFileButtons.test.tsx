import { test, expect, beforeEach } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createDefaultProject } from "@/core/default-project";
import { writeProjectFile } from "@/core/project-file";
import { projectStore } from "@/state/project-store";
import { ProjectFileButtons } from "./ProjectFileButtons";

beforeEach(() => {
  projectStore.setState({ project: createDefaultProject() });
  projectStore.temporal.getState().clear();
});

function projectFile(contents: string) {
  return new File([contents], "acme.brandkit.json", { type: "application/json" });
}

test("opening a project file replaces the project, and the swap can be undone", async () => {
  const saved = createDefaultProject();
  render(<ProjectFileButtons />);
  await userEvent.upload(
    screen.getByLabelText("Open project"),
    projectFile(writeProjectFile({ ...saved, meta: { name: "Acme", namespace: "acme" } }, {})),
  );
  expect(await screen.findByText("Opened Acme.")).toBeInTheDocument();
  expect(projectStore.getState().project.meta.name).toBe("Acme");
  projectStore.temporal.getState().undo();
  expect(projectStore.getState().project.meta.name).toBe("My brand");
});

test("opening a file that isn't a project explains why and changes nothing", async () => {
  render(<ProjectFileButtons />);
  await userEvent.upload(screen.getByLabelText("Open project"), projectFile("hello"));
  expect(await screen.findByRole("alert")).toHaveTextContent("This file isn't a Brandkit project.");
  expect(projectStore.getState().project).toEqual(createDefaultProject());
});

test("there is a button to save the project", () => {
  render(<ProjectFileButtons />);
  expect(screen.getByRole("button", { name: "Save project" })).toBeEnabled();
});
