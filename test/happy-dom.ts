// Preloaded by bunfig.toml so component tests get a DOM and jest-dom matchers.
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

// Imported after registering, because Testing Library binds `screen` to the document on import.
const { expect, afterEach } = await import("bun:test");
const { default: _default, ...matchers } = await import("@testing-library/jest-dom/matchers");
const { cleanup } = await import("@testing-library/react");

expect.extend(matchers);
afterEach(cleanup);
