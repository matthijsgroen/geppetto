import type { AnimationControlTrack } from "geppetto-player";

import {
  addAnimation,
  addControlFrameToAnimation,
  createAnimationControlTrack,
  deleteAnimation,
  deleteControlTrackFromAnimation,
  hasAnimations,
  hasAnimationsWithData,
  moveControlTrackToAnimation,
  renameAnimation,
  resizeControlFrame,
  updateAnimationControlTrackLength,
  updateAnimationSpeedModifier,
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

  it("places the new animation in the animation hierarchy", () => {
    const file = newFile();

    const updatedFile = addAnimation()(file);

    expect(updatedFile.animationHierarchy["0"]).toEqual({
      type: "animation",
      parentId: "root",
    });
    const rootChildren = updatedFile.animationHierarchy.root.children;
    expect(rootChildren).toContain("0");
  });
});

describe("deleteAnimation", () => {
  it("deletes the specified animation", () => {
    const file = fileBuilder().addAnimation("walk").build();

    const updatedFile = deleteAnimation("0")(file);

    expect(file.animations["0"]).toBeDefined();
    expect(updatedFile.animations["0"]).toBeUndefined();
  });

  it("removes the animation from the animation hierarchy", () => {
    const file = fileBuilder().addAnimation("walk").build();

    const updatedFile = deleteAnimation("0")(file);
    expect(updatedFile.animationHierarchy["0"]).toBeUndefined();
    const rootChildren = updatedFile.animationHierarchy.root.children;
    expect(rootChildren).not.toContain("0");
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

  it("moves existing items up when adding a control frame that overlaps", () => {
    const file = fileBuilder()
      .addControl("move")
      .addAnimation("walk")
      .addControlFrame("move", 0, 1000, 0.5)
      .addControlFrame("move", 1500, 1000, 1.0)
      .build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = addControlFrameToAnimation(
      "0",
      controlId,
      1200,
      2000,
      0.75
    )(file);

    const updatedAnimation = updatedFile.animations["0"];

    const track = updatedAnimation.tracks[0];
    const controlTrack = track as AnimationControlTrack;
    expect(controlTrack.actions).toHaveLength(3);
    expect(controlTrack.actions[0].start).toBe(0);
    expect(controlTrack.actions[0].duration).toBe(1000);

    expect(controlTrack.actions[1].start).toBe(1200);
    expect(controlTrack.actions[1].duration).toBe(2000);

    expect(controlTrack.actions[2].start).toBe(3200);
    expect(controlTrack.actions[2].duration).toBe(1000);
  });

  it("shortens existing item when start during other frame", () => {
    const file = fileBuilder()
      .addControl("move")
      .addAnimation("walk")
      .addControlFrame("move", 0, 2000, 0.5)
      .addControlFrame("move", 2000, 1000, 0.5)
      .build();
    const controlId = getControlIdByName(file, "move");
    const updatedFile = addControlFrameToAnimation(
      "0",
      controlId,
      1500,
      1000,
      0.75
    )(file);

    const updatedAnimation = updatedFile.animations["0"];

    const track = updatedAnimation.tracks[0];
    const controlTrack = track as AnimationControlTrack;
    expect(controlTrack.actions).toHaveLength(3);
    expect(controlTrack.actions[0].start).toBe(0);
    expect(controlTrack.actions[0].duration).toBe(1500);

    expect(controlTrack.actions[1].start).toBe(1500);
    expect(controlTrack.actions[1].duration).toBe(1000);

    expect(controlTrack.actions[2].start).toBe(2500);
    expect(controlTrack.actions[2].duration).toBe(1000);
  });
});

describe("deleteControlTrackFromAnimation", () => {
  it("deletes the specified control track from the animation", () => {
    const file = fileBuilder()
      .addAnimation("walk")
      .addControl("move")
      .addControlFrame("move", 0, 1000, 0.5)
      .addControlFrame("move", 1500, 1000, 1.0)
      .build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = deleteControlTrackFromAnimation("0", controlId)(file);

    const originalAnimation = file.animations["0"];
    const updatedAnimation = updatedFile.animations["0"];

    expect(originalAnimation.tracks).toHaveLength(1);
    expect(updatedAnimation.tracks).toHaveLength(0);
  });
});

describe("moveControlTrackToAnimation", () => {
  it("moves the specified control track from one animation to another", () => {
    const file = fileBuilder()
      .addControl("move")
      .addAnimation("walk")
      .addControlFrame("move", 0, 1000, 0.5)
      .addControlFrame("move", 1500, 1000, 1.0)
      .addAnimation("run")
      .build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = moveControlTrackToAnimation("0", "1", controlId)(file);

    const updatedWalkAnimation = updatedFile.animations["0"];
    const updatedRunAnimation = updatedFile.animations["1"];

    expect(updatedWalkAnimation.tracks).toHaveLength(0);
    expect(updatedRunAnimation.tracks).toHaveLength(1);

    const track = updatedRunAnimation.tracks[0];
    expect(track.type).toBe("control");
    const controlTrack = track as AnimationControlTrack;
    expect(controlTrack.controlId).toBe(controlId);
    expect(controlTrack.actions).toHaveLength(2);
  });
});

describe("updateAnimationSpeedModifier", () => {
  it("updates the speed modifier of the specified animation", () => {
    const file = fileBuilder().addAnimation("walk").build();

    const updatedFile = updateAnimationSpeedModifier("0", 1.5)(file);

    expect(file.animations["0"].speedModifier).toBeUndefined();
    expect(updatedFile.animations["0"].speedModifier).toBe(1.5);
  });

  it("removes the speed modifier if undefined is passed", () => {
    const file = fileBuilder().addAnimation("walk").build();
    const fileWithSpeed = updateAnimationSpeedModifier("0", 2.0)(file);

    const updatedFile = updateAnimationSpeedModifier(
      "0",
      undefined
    )(fileWithSpeed);

    expect(fileWithSpeed.animations["0"].speedModifier).toBe(2.0);
    expect(updatedFile.animations["0"].speedModifier).toBeUndefined();
  });
});

describe("createAnimationControlTrack", () => {
  it("creates a control track in the specified animation", () => {
    const file = fileBuilder().addAnimation("walk").addControl("move").build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = createAnimationControlTrack("0", controlId)(file);

    const originalAnimation = file.animations["0"];
    const updatedAnimation = updatedFile.animations["0"];

    expect(originalAnimation.tracks).toHaveLength(0);
    expect(updatedAnimation.tracks).toHaveLength(1);

    const track = updatedAnimation.tracks[0];
    expect(track.type).toBe("control");
    const controlTrack = track as AnimationControlTrack;
    expect(controlTrack.controlId).toBe(controlId);
    expect(controlTrack.actions).toHaveLength(0);
  });
});

describe("updateAnimationControlTrackLength", () => {
  it("updates the length of the specified control track", () => {
    const file = fileBuilder()
      .addAnimation("walk")
      .addControl("move")
      .addControlFrame("move", 0, 1000, 0.5)
      .build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = updateAnimationControlTrackLength(
      "0",
      controlId,
      5000
    )(file);

    const originalAnimation = file.animations["0"];
    const updatedAnimation = updatedFile.animations["0"];

    const originalTrack = originalAnimation.tracks[0] as AnimationControlTrack;
    const updatedTrack = updatedAnimation.tracks[0] as AnimationControlTrack;

    expect(originalTrack.length).toBe(1000);
    expect(updatedTrack.length).toBe(5000);
  });

  it("squeezes actions if new length is shorter than existing actions", () => {
    const file = fileBuilder()
      .addAnimation("walk")
      .addControl("move")
      .addControlFrame("move", 0, 2000, 0.5)
      .addControlFrame("move", 2500, 2000, 1.0)
      .build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = updateAnimationControlTrackLength(
      "0",
      controlId,
      3000
    )(file);

    const originalAnimation = file.animations["0"];
    const updatedAnimation = updatedFile.animations["0"];

    const originalTrack = originalAnimation.tracks[0] as AnimationControlTrack;
    const updatedTrack = updatedAnimation.tracks[0] as AnimationControlTrack;

    expect(originalTrack.length).toBe(4500);
    expect(updatedTrack.length).toBe(3000);

    expect(originalTrack.actions).toHaveLength(2);
    expect(updatedTrack.actions).toHaveLength(2);

    const originalFirstAction = originalTrack.actions[0];
    const updatedFirstAction = updatedTrack.actions[0];
    expect(originalFirstAction.start).toBe(0);
    expect(originalFirstAction.duration).toBe(2000);
    expect(updatedFirstAction.start).toBe(0);
    expect(updatedFirstAction.duration).toBeCloseTo(1333.33, 2);

    const originalSecondAction = originalTrack.actions[1];
    const updatedSecondAction = updatedTrack.actions[1];
    expect(originalSecondAction.start).toBe(2500);
    expect(originalSecondAction.duration).toBe(2000);
    expect(updatedSecondAction.start).toBeCloseTo(1666.67, 2);
    expect(updatedSecondAction.duration).toBeCloseTo(1333.33, 2);
  });
});

describe("resizeControlFrame", () => {
  it("resizes the specified control frame", () => {
    const file = fileBuilder()
      .addAnimation("walk")
      .addControl("move")
      .addControlFrame("move", 0, 2000, 0.5)
      .build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = resizeControlFrame("0", controlId, 0, 0, 3000)(file);
    const updatedAnimation = updatedFile.animations["0"];
    const updatedTrack = updatedAnimation.tracks[0] as AnimationControlTrack;
    const updatedAction = updatedTrack.actions[0];

    expect(updatedAction.start).toBe(0);
    expect(updatedAction.duration).toBe(3000);
  });

  it("resizes the specified control frame and adjacent frames on overlap (next)", () => {
    const file = fileBuilder()
      .addAnimation("walk")
      .addControl("move")
      .addControlFrame("move", 0, 2000, 0.5)
      .addControlFrame("move", 2500, 2000, 0.5)
      .build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = resizeControlFrame("0", controlId, 0, 0, 3000)(file);
    const updatedAnimation = updatedFile.animations["0"];
    const updatedTrack = updatedAnimation.tracks[0] as AnimationControlTrack;
    const updatedAction = updatedTrack.actions[0];

    expect(updatedAction.start).toBe(0);
    expect(updatedAction.duration).toBe(3000);

    const adjacentAction = updatedTrack.actions[1];

    expect(adjacentAction.start).toBe(3000);
    expect(adjacentAction.duration).toBe(1500);
  });

  it("resizes the specified control frame and adjacent frames on overlap (previous)", () => {
    const file = fileBuilder()
      .addAnimation("walk")
      .addControl("move")
      .addControlFrame("move", 0, 2000, 0.5)
      .addControlFrame("move", 2500, 2000, 0.5)
      .build();
    const controlId = getControlIdByName(file, "move");

    const updatedFile = resizeControlFrame("0", controlId, 1, 1500, 3000)(file);
    const updatedAnimation = updatedFile.animations["0"];
    const updatedTrack = updatedAnimation.tracks[0] as AnimationControlTrack;
    const updatedAction = updatedTrack.actions[1];

    expect(updatedAction.start).toBe(1500);
    expect(updatedAction.duration).toBe(3000);

    const adjacentAction = updatedTrack.actions[0];

    expect(adjacentAction.start).toBe(0);
    expect(adjacentAction.duration).toBe(1500);
  });
});
