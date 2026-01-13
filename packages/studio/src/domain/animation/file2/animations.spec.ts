import type { AnimationControlTrack } from "geppetto-player";

import {
  addAnimation,
  addControlFrameToAnimation,
  deleteAnimation,
  getNextAnimationId,
  hasAnimations,
  hasAnimationsWithData,
  renameAnimation,
  updateLoopingAnimation,
} from "@/domain/animation/file2/animations";
import { newFile } from "@/domain/animation/file2/new";
import {
  fileBuilder,
  getControlIdByName,
} from "@/domain/animation/file2/testFileBuilder";

describe("hasAnimations", () => {
  it("returns false if file has no animations", () => {
    const file = newFile();

    const result = hasAnimations(file);
    expect(result).toBe(false);
  });

  it("returns true if file has animations", () => {
    const file = fileBuilder().addAnimation("walk").build();
    const result = hasAnimations(file);
    expect(result).toBe(true);
  });
});

describe("hasAnimationsWithData", () => {
  it("returns false if file has no animations", () => {
    const file = newFile();

    const result = hasAnimationsWithData(file);
    expect(result).toBe(false);
  });

  it("returns false if file has animations without data", () => {
    const file = fileBuilder().addAnimation("walk").build();

    const result = hasAnimationsWithData(file);
    expect(result).toBe(false);
  });

  it("returns true if file has animations with data", () => {
    const file = fileBuilder()
      .addAnimation("walk")
      .addControl("move")
      .addControlFrame("move", 0, 10, 1.0)
      .build();

    const result = hasAnimationsWithData(file);
    expect(result).toBe(true);
  });
});

describe("getNextAnimationId", () => {
  it("returns '0' for empty file", () => {
    const file = newFile();

    const result = getNextAnimationId(file);
    expect(result).toBe("0");
  });

  it("returns next available id", () => {
    const file = fileBuilder().addAnimation("walk").addAnimation("run").build();

    const result = getNextAnimationId(file);
    expect(result).toBe("2");
  });
});

describe("updateLoopingAnimation", () => {
  it("updates the looping property of the specified animation", () => {
    const file = fileBuilder().addAnimation("walk").build();

    const updatedFile = updateLoopingAnimation("0", true)(file);

    expect(file.animations["0"].looping).toBe(false);
    expect(updatedFile.animations["0"].looping).toBe(true);
  });
});

describe("addAnimation", () => {
  it("adds a new animation with the specified name", () => {
    const file = newFile();

    const updatedFile = addAnimation()(file);

    expect(Object.keys(updatedFile.animations)).toHaveLength(1);
    const addedAnimation = updatedFile.animations["0"];
    expect(addedAnimation).toBeDefined();
    expect(addedAnimation.name).toBe("animation 1");
    expect(addedAnimation.tracks).toEqual([]);
    expect(addedAnimation.events).toEqual([]);
    expect(addedAnimation.looping).toBe(false);
  });
});

describe("deleteAnimation", () => {
  it("deletes the specified animation", () => {
    const file = fileBuilder().addAnimation("walk").build();

    const updatedFile = deleteAnimation("0")(file);

    expect(file.animations["0"]).toBeDefined();
    expect(updatedFile.animations["0"]).toBeUndefined();
  });
});

describe("renameAnimation", () => {
  it("renames the specified animation", () => {
    const file = fileBuilder().addAnimation("walk").build();

    const updatedFile = renameAnimation("0", "run")(file);

    expect(file.animations["0"].name).toBe("walk");
    expect(updatedFile.animations["0"].name).toBe("run");
  });

  it("adds a suffix if the name already exists", () => {
    const file = fileBuilder().addAnimation("walk").addAnimation("run").build();

    const updatedFile = renameAnimation("0", "run")(file);

    expect(file.animations["0"].name).toBe("walk");
    expect(updatedFile.animations["0"].name).toBe("run 2");
  });

  it("adds a suffix if the name already exists", () => {
    const file = fileBuilder()
      .addAnimation("walk")
      .addAnimation("run")
      .addAnimation("run 2")
      .build();

    const updatedFile = renameAnimation("0", "run")(file);

    expect(file.animations["0"].name).toBe("walk");
    expect(updatedFile.animations["0"].name).toBe("run 3");
  });
});

describe("addControlFrameToAnimation", () => {
  it("adds a control frame to the specified animation and control, creating a track if it was not there", () => {
    const file = fileBuilder().addAnimation("walk").addControl("move").build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = addControlFrameToAnimation(
      "0",
      controlId,
      0,
      1500,
      1.0,
      "easeInOut",
      0.0
    )(file);

    const originalAnimation = file.animations["0"];
    const updatedAnimation = updatedFile.animations["0"];

    expect(originalAnimation.tracks).toHaveLength(0);
    expect(updatedAnimation.tracks).toHaveLength(1);

    const track = updatedAnimation.tracks[0];
    expect(track.type).toBe("control");
    const controlTrack = track as AnimationControlTrack;
    expect(controlTrack.controlId).toBe(controlId);
    expect(controlTrack.actions).toHaveLength(1);

    const action = controlTrack.actions[0];
    expect(action.start).toBe(0);
    expect(action.duration).toBe(1500);
    expect(action.controlEndValue).toBe(1.0);
    expect(action.easingFunction).toBe("easeInOut");
    expect(action.controlStartValue).toBe(0.0);
  });

  it("adds a control frame to the specified animation and control, when track already exists", () => {
    const file = fileBuilder()
      .addAnimation("walk")
      .addControl("move")
      .addControlFrame("move", 0, 1000, 0.5)
      .build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = addControlFrameToAnimation(
      "0",
      controlId,
      1500,
      1000,
      1.0,
      "easeInOut",
      0.0
    )(file);

    const originalAnimation = file.animations["0"];
    const updatedAnimation = updatedFile.animations["0"];

    expect(originalAnimation.tracks).toHaveLength(1);
    expect(updatedAnimation.tracks).toHaveLength(1);

    const track = updatedAnimation.tracks[0];
    expect(track.type).toBe("control");
    const controlTrack = track as AnimationControlTrack;
    expect(controlTrack.controlId).toBe(controlId);
    expect(controlTrack.actions).toHaveLength(2);

    const action = controlTrack.actions[1];
    expect(action.start).toBe(1500);
    expect(action.duration).toBe(1000);
    expect(action.controlEndValue).toBe(1.0);
    expect(action.easingFunction).toBe("easeInOut");
    expect(action.controlStartValue).toBe(0.0);
  });
});
