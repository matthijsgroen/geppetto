import { setProjectAnnotations } from "@storybook/react-vite";
import * as projectAnnotations from "./preview";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
// @ts-expect-error -- Ignore --
setProjectAnnotations([projectAnnotations]);

// Suppress null console logs in browser tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = (...args: unknown[]) => {
  if (args.length === 1 && (args[0] === null || args[0] === undefined)) {
    return;
  }
  originalConsoleLog.apply(console, args);
};

console.error = (...args: unknown[]) => {
  if (args.length === 1 && (args[0] === null || args[0] === undefined)) {
    return;
  }
  if (
    args[0] &&
    args[0]
      .toString()
      .includes(
        "A component suspended inside an `act` scope, but the `act` call was not awaited"
      )
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};
