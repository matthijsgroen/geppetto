import { isFrameControlAction } from "./animations";
import { FrameAction } from "./types";

describe("isFrameControlAction", () => {
  it("returns true for a FrameControlAction", () => {
    const action: FrameAction = {
      controlId: "3",
      controlValue: 1,
      start: 4500,
      duration: 500,
      easingFunction: "linear",
    };

    expect(isFrameControlAction(action)).toBe(true);
  });

  it("returns false when not a FrameControlAction", () => {
    const action: FrameAction = {
      layerId: "3",
      start: 4500,
      visible: false,
    };

    expect(isFrameControlAction(action)).toBe(false);
  });
});
