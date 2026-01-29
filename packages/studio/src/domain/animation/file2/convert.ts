import type {
  Animation,
  AnimationControlTrack,
  FrameControlAction,
  FrameEvent,
  GeppettoImage,
  Hierarchy,
  NodeType,
} from "@geppetto/types";

import {
  type ImageDefinition,
  type MutationVector,
} from "@/dtos/animation-file1.dto";

import { newFile } from "./new";

const populateMutations = (
  mutations: MutationVector[],
  target: GeppettoImage,
  createId: () => string,
  result: Hierarchy<NodeType>,
  parentId: string
): string[] => {
  const ids: string[] = [];
  for (const mutation of mutations) {
    const id = createId();
    result[id] = {
      parentId,
      type: "mutation",
    };
    ids.push(id);

    target.mutations[id] = {
      ...mutation,
    };
    if (
      target.mutations[id].type === "translate" ||
      target.mutations[id].type === "deform"
    ) {
      target.mutations[id].radius = target.mutations[id].radius ?? -1;
    }
  }
  return ids;
};

const populateShapes = (
  shapes: ImageDefinition["shapes"],
  target: GeppettoImage,
  createId: () => string,
  result: Hierarchy<NodeType>,
  parentId: string | null = null
): string[] => {
  const childIds: string[] = [];
  for (const shape of shapes) {
    if (shape.type === "folder") {
      const id = createId();
      result[id] = {
        type: "layerFolder",
        parentId: parentId !== null ? parentId : "root",
        children: [
          ...populateMutations(
            shape.mutationVectors,
            target,
            createId,
            result,
            id
          ),
          ...populateShapes(shape.items, target, createId, result, id),
        ],
      };
      childIds.push(id);

      target.layerFolders[id] = {
        name: shape.name,
        visible: true,
        collapsed: false,
      };
    } else {
      const id = createId();
      const mutations = populateMutations(
        shape.mutationVectors,
        target,
        createId,
        result,
        id
      );

      result[id] = {
        type: "layer",
        parentId: parentId !== null ? parentId : "root",
        ...(mutations.length > 0 ? { children: mutations } : undefined),
      };
      childIds.push(id);

      target.layers[id] = {
        name: shape.name,
        visible: true,
        points: shape.points,
        translate: shape.translate,
      };
    }
  }
  return childIds;
};

const getMutationId = (target: GeppettoImage, name: string): string => {
  const result = Object.entries(target.mutations).find(
    ([, m]) => m.name === name
  );
  return result?.[0] ?? "error";
};

const getControlId = (target: GeppettoImage, name: string): string => {
  const result = Object.entries(target.controls).find(
    ([, m]) => m.name === name
  );
  return result?.[0] ?? "error";
};

const populateControls = (
  controls: ImageDefinition["controls"],
  target: GeppettoImage,
  createId: () => string
): Hierarchy<"controlFolder" | "control"> => {
  const result: Hierarchy<"control"> = {};
  const ids: string[] = [];
  for (const control of controls) {
    const id = createId();
    ids.push(id);
    result[id] = {
      type: "control",
      parentId: "root",
    };

    target.controls[id] = {
      name: control.name,
      type: control.type,
      steps: control.steps.map((step) =>
        Object.entries(step).reduce(
          (map, [key, value]) => ({
            ...map,
            [getMutationId(target, key)]: value,
          }),
          {}
        )
      ),
    };
  }
  result.root = { type: "root", children: ids };
  return result;
};

const convertKeyframeToTracks = (
  keyframes: ImageDefinition["animations"][0]["keyframes"],
  target: GeppettoImage
): AnimationControlTrack[] => {
  const controlTracks: Record<string, AnimationControlTrack> = {};
  let trackLength = 0;

  for (const keyframe of keyframes) {
    for (const [controlName, controlValue] of Object.entries(
      keyframe.controlValues
    )) {
      const controlId = getControlId(target, controlName);
      if (!controlTracks[controlId]) {
        controlTracks[controlId] = {
          type: "control",
          controlId,
          length: 0,
          actions: [],
        };
      }

      const track = controlTracks[controlId];
      const lastAction: FrameControlAction | undefined =
        track.actions[track.actions.length - 1];
      const previousEnd = lastAction
        ? lastAction.start + lastAction.duration
        : 0;

      if (keyframe.time > trackLength) {
        trackLength = keyframe.time;
      }

      if (lastAction && lastAction.duration === 1) {
        lastAction.controlStartValue = lastAction.controlEndValue;
        lastAction.duration = keyframe.time - lastAction.start;

        lastAction.controlEndValue = controlValue;
        continue;
      }
      if (lastAction && lastAction.duration === 0) {
        lastAction.controlStartValue = lastAction.controlEndValue;
        lastAction.duration = keyframe.time - lastAction.start;

        lastAction.controlEndValue = controlValue;
        continue;
      }

      track.actions.push({
        start: previousEnd,
        duration: keyframe.time - previousEnd,
        easingFunction: "linear",
        controlEndValue: controlValue,
      });
    }
  }

  return Object.values(controlTracks).map((track) => ({
    ...track,
    length: trackLength,
  }));
};

const convertEvents = (
  keyframes: ImageDefinition["animations"][0]["keyframes"],
  _target: GeppettoImage
): FrameEvent[] => {
  const events: FrameEvent[] = [];
  for (const keyframe of keyframes) {
    if (keyframe.event) {
      events.push({
        start: keyframe.time,
        eventName: keyframe.event,
      });
    }
  }
  return events;
};

const populateAnimations = (
  animations: ImageDefinition["animations"],
  target: GeppettoImage,
  createId: () => string
): Hierarchy<"animation"> => {
  const result: Hierarchy<"animation"> = {};
  const newAnimations: Record<string, Animation> = {};
  const ids: string[] = [];
  for (const animation of animations) {
    const id = createId();
    ids.push(id);
    result[id] = {
      type: "animation",
      parentId: "root",
    };
    newAnimations[id] = {
      name: animation.name,
      looping: animation.looping,
      tracks: convertKeyframeToTracks(animation.keyframes, target),
      events: convertEvents(animation.keyframes, target),
    };
  }
  target.animations = newAnimations;

  result.root = { type: "root", children: ids };
  return result;
};

export const convertFromV1 = (imageDef: ImageDefinition): GeppettoImage => {
  const result: GeppettoImage = newFile();
  let id = 0;
  const createId = () => {
    const result = `${id}`;
    id++;
    return result;
  };

  const childIds = populateShapes(
    imageDef.shapes,
    result,
    createId,
    result.layerHierarchy
  );
  result.layerHierarchy.root = { type: "root", children: childIds };

  id = 0;
  result.controlHierarchy = populateControls(
    imageDef.controls,
    result,
    createId
  );

  for (const key in imageDef.controlValues) {
    const value = imageDef.controlValues[key];
    const id = getControlId(result, key);
    result.controlValues[id] = value;
  }
  for (const key in imageDef.defaultFrame) {
    const value = imageDef.defaultFrame[key];
    const id = getMutationId(result, key);
    result.defaultFrame[id] = value;
  }

  if (imageDef.animations) {
    id = 0;
    result.animationHierarchy = populateAnimations(
      imageDef.animations,
      result,
      createId
    );
  }

  return result;
};
