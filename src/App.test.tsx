import { test, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("app shell shows the product title", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: "Brandkit for Claude" })).toBeInTheDocument();
});
