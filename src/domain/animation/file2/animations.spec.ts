import type {
  FrameAction,
  FrameControlAction,
  FrameEvent,
} from "@/dtos/animation-file2.dto";

import { isFrameControlAction, isFrameEvent } from "./animations";

describe("isFrameControlAction", () => {
  it("returns true for a FrameControlAction", () => {
    const action: FrameAction = {
      frameId: "1",
      controlId: "3",
      controlEndValue: 1,
      start: 4500,
      duration: 500,
      easingFunction: "linear",
    };

    expect(isFrameControlAction(action)).toBe(true);
  });

  it("returns false when not a FrameControlAction", () => {
    const action: FrameAction = {
      frameId: "2",
      layerId: "3",
      start: 4500,
      visible: false,
    };

    expect(isFrameControlAction(action)).toBe(false);
  });
});

describe("isFrameEvent", () => {
  it("returns true for a FrameEventAction", () => {
    const action: FrameEvent = {
      frameId: "3",
      event: "jump",
      start: 3000,
    };

    expect(isFrameEvent(action)).toBe(true);
  });

  it("returns false when not a FrameEventAction", () => {
    const action: FrameControlAction = {
      frameId: "1",
      controlId: "3",
      controlEndValue: 1,
      start: 4500,
      duration: 500,
      easingFunction: "linear",
    };

    expect(isFrameEvent(action)).toBe(false);
  });
});
