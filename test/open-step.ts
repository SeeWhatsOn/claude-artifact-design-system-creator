import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/** Walks the guided path with Next, as a user would, until the named step is showing. */
export async function openStep(label: string) {
  for (let i = 0; i < 20; i++) {
    const step = screen.getByRole("region", { name: "Step" });
    if (within(step).queryByRole("heading", { level: 2, name: label })) return;
    await userEvent.click(within(step).getByRole("button", { name: /^Next/ }));
  }
  throw new Error(`No step called ${label}`);
}
