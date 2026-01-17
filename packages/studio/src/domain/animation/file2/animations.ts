import type {
  Animation,
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

export const getAnimationName = (file: GeppettoImage) => {
  let id = 1;
  const names = Object.values(file.animations).map((a) => a.name);
  while (names.includes(`animation ${id}`)) {
    id++;
  }
  return `animation ${id}`;
};

export const updateLoopingAnimation = (animationId: string, looping: boolean) =>
  produce<GeppettoImage>((draft) => {
    draft.animations[animationId].looping = looping;
  });

export type AddAnimationDetails = {
  id: string;
  animation: Animation;
};

export const addAnimation = (
  dataResult?: AddAnimationDetails | Record<string, never>
) =>
  produce<GeppettoImage>((draft) => {
    const newAnimationId = getNextAnimationId(draft);
    const newAnimationName = getAnimationName(draft);

    draft.animations[newAnimationId] = {
      name: newAnimationName,
      tracks: [],
      events: [],
      looping: false,
    };
    if (dataResult) {
      Object.assign(dataResult, {
        id: newAnimationId,
        animation: draft.animations[newAnimationId],
      });
    }
  });

export const renameAnimation = (animationId: string, newName: string) =>
  produce<GeppettoImage>((draft) => {
    const animation = draft.animations[animationId];
    const existingNames = Object.entries(draft.animations)
      .filter(([id]) => id !== animationId)
      .map(([, a]) => a.name);

    let uniqueName = newName;
    let counter = 2;
    while (existingNames.includes(uniqueName)) {
      uniqueName = `${newName} ${counter}`;
      counter++;
    }

    if (animation) {
      animation.name = uniqueName;
    }
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

export const deleteAnimation = (animationId: string) =>
  produce<GeppettoImage>((draft) => {
    delete draft.animations[animationId];
  });

export const deleteControlTrackFromAnimation = (
  animationId: string,
  controlId: string
) =>
  produce<GeppettoImage>((draft) => {
    const animation = draft.animations[animationId];
    if (!animation) {
      return;
    }

    animation.tracks = animation.tracks.filter(
      (t) => !(t.type === "control" && t.controlId === controlId)
    );
  });

export const moveControlTrackToAnimation = (
  fromAnimationId: string,
  toAnimationId: string,
  controlId: string
) =>
  produce<GeppettoImage>((draft) => {
    const fromAnimation = draft.animations[fromAnimationId];
    const toAnimation = draft.animations[toAnimationId];
    if (!fromAnimation || !toAnimation) {
      return;
    }

    const trackIndex = fromAnimation.tracks.findIndex(
      (t) => t.type === "control" && t.controlId === controlId
    );
    if (trackIndex === -1) {
      return;
    }

    const [track] = fromAnimation.tracks.splice(trackIndex, 1);
    toAnimation.tracks.push(track);
  });

export const updateAnimationSpeedModifier = (
  animationId: string,
  speedModifier: number | undefined
) =>
  produce<GeppettoImage>((draft) => {
    const animation = draft.animations[animationId];
    if (!animation) {
      return;
    }

    if (speedModifier === undefined) {
      delete animation.speedModifier;
    } else {
      animation.speedModifier = speedModifier;
    }
  });

export const createAnimationControlTrack = (
  animationId: string,
  controlId: string
) =>
  produce<GeppettoImage>((draft) => {
    const animation = draft.animations[animationId];
    if (!animation) {
      return;
    }

    let track = animation.tracks.find(
      (t): t is AnimationControlTrack =>
        t.type === "control" && t.controlId === controlId
    );

    if (!track) {
      track = {
        type: "control",
        controlId,
        actions: [],
        length: 0,
      };
      animation.tracks.push(track);
    }
  });

export const updateAnimationControlTrackLength = (
  animationId: string,
  controlId: string,
  newLength: number
) =>
  produce<GeppettoImage>((draft) => {
    const animation = draft.animations[animationId];
    if (!animation) {
      return;
    }

    const track = animation.tracks.find(
      (t): t is AnimationControlTrack =>
        t.type === "control" && t.controlId === controlId
    );

    if (track) {
      track.length = newLength;
    }
  });
