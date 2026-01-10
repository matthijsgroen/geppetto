import type {
  AnimationControlTrack,
  EasingFunction,
  FrameControlAction,
  GeppettoImage,
} from "@geppetto/types";
import { produce } from "immer";

export const hasAnimations = (file: GeppettoImage) =>
  Object.keys(file.animations).length > 0;

export const hasAnimationsWithData = (file: GeppettoImage) =>
  Object.values(file.animations).some(
    (animation) => Object.keys(animation.tracks).length > 0
  );

export const getNextAnimationId = (file: GeppettoImage): string => {
  let id = 0;
  while (`${id}` in file.animations) {
    id++;
  }
  return `${id}`;
};

export const updateLoopingAnimation = (animationID: string, looping: boolean) =>
  produce<GeppettoImage>((draft) => {
    draft.animations[animationID].looping = looping;
  });

export const addAnimation = (animationName: string) =>
  produce<GeppettoImage>((draft) => {
    const newAnimationId = getNextAnimationId(draft);
    draft.animations[newAnimationId] = {
      name: animationName,
      tracks: [],
      events: [],
      looping: false,
    };
  });

export const addControlFrameToAnimation = (
  animationId: string,
  controlId: string,
  start: number,
  duration: number,
  endValue: number,
  easing: EasingFunction = "linear",
  startValue?: number
) =>
  produce<GeppettoImage>((draft) => {
    const animation = draft.animations[animationId];
    if (!animation) {
      return;
    }

    const currentMaxLength = Math.max(
      ...animation.tracks.map((t) => t.length),
      start + duration
    );

    let track = animation.tracks.find(
      (t): t is AnimationControlTrack =>
        t.type === "control" && t.controlId === controlId
    );

    if (!track) {
      track = {
        type: "control",
        controlId,
        actions: [],
        length: currentMaxLength,
      };
      animation.tracks.push(track);
    }
    track.length = currentMaxLength;

    const action: FrameControlAction = {
      start,
      controlEndValue: endValue,
      duration,
      easingFunction: easing,
    };

    if (startValue !== undefined) {
      action.controlStartValue = startValue;
    }
    // TODO: Handle overlapping frames

    track.actions.push(action);
  });
