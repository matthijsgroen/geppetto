import { AnimationFrame, ImageDefinition, MutationVector } from "../types";
import { FrameAction, GeppettoImage, NodeType, TreeNode } from "./types";

export const newFile = (): GeppettoImage => ({
  version: "2.0",
  metadata: {
    width: 2048,
    height: 1536,
    zoom: 1.0,
    pan: [0, 0],
  },
  layerHierarchy: [],
  layerFolders: {},
  layers: {},
  mutations: {},

  controlHierarchy: [],
  controlFolders: {},
  controls: {},
  defaultFrame: {},
  controlValues: {},

  animationHierarchy: [],
  animationFolders: {},
  animations: {},
});

const populateMutations = (
  mutations: MutationVector[],
  target: GeppettoImage,
  createId: () => string
): TreeNode<"mutation">[] => {
  const result: TreeNode<"mutation">[] = [];
  for (const mutation of mutations) {
    const id = createId();
    result.push({
      id,
      type: "mutation",
    });

    target.mutations[id] = {
      ...mutation,
    };
  }
  return result;
};

const populateShapes = (
  shapes: ImageDefinition["shapes"],
  target: GeppettoImage,
  createId: () => string
): TreeNode<NodeType>[] => {
  const result: TreeNode<NodeType>[] = [];
  for (const shape of shapes) {
    if (shape.type === "folder") {
      const id = createId();
      result.push({
        id,
        type: "layerFolder",
        children: [
          ...populateMutations(shape.mutationVectors, target, createId),
          ...populateShapes(shape.items, target, createId),
        ],
      });

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
        createId
      );

      result.push({
        id,
        type: "layer",
        ...(mutations.length > 0 ? { children: mutations } : undefined),
      });

      target.layers[id] = {
        name: shape.name,
        visible: true,
        points: shape.points,
        translate: shape.translate,
      };
    }
  }
  return result;
};

const getMutationId = (target: GeppettoImage, name: string) => {
  const result = Object.entries(target.mutations).find(
    ([, m]) => m.name === name
  );
  if (result === undefined) {
    return "error";
  }
  return result[0];
};

const getControlId = (target: GeppettoImage, name: string) => {
  const result = Object.entries(target.controls).find(
    ([, m]) => m.name === name
  );
  if (result === undefined) {
    return "error";
  }
  return result[0];
};

const populateControls = (
  controls: ImageDefinition["controls"],
  target: GeppettoImage,
  createId: () => string
): TreeNode<"controlFolder" | "control">[] => {
  const result: TreeNode<"control">[] = [];
  for (const control of controls) {
    const id = createId();
    result.push({
      id,
      type: "control",
    });

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
  return result;
};

const convertKeyframes = (
  keyframes: AnimationFrame[],
  target: GeppettoImage
): FrameAction[] => {
  const result: FrameAction[] = [];
  const lastControlEvent: Record<string, number> = {};

  for (const frame of keyframes) {
    for (const control in frame.controlValues) {
      const controlId = getControlId(target, control);

      const controlStart = lastControlEvent[controlId] ?? 0;
      const duration = frame.time - controlStart;

      result.push({
        start: controlStart,
        duration,
        easingFunction: "linear",
        controlId,
        controlValue: frame.controlValues[control],
      });
      lastControlEvent[controlId] = frame.time;
    }
    if (frame.event) {
      result.push({
        start: frame.time,
        event: frame.event,
      });
    }
  }

  return result.sort((a, b) => a.start - b.start);
};

const populateAnimations = (
  animations: ImageDefinition["animations"],
  target: GeppettoImage,
  createId: () => string
): TreeNode<"animationFolder" | "animation">[] => {
  const result: TreeNode<"animation">[] = [];
  for (const animation of animations) {
    const id = createId();
    result.push({
      id,
      type: "animation",
    });

    target.animations[id] = {
      name: animation.name,
      looping: animation.looping,
      actions: convertKeyframes(animation.keyframes, target),
    };
  }
  return result;
};

export const convertV1toV2 = (imageDef: ImageDefinition): GeppettoImage => {
  const result: GeppettoImage = newFile();
  let id = 0;
  const createId = () => {
    const result = `${id}`;
    id++;
    return result;
  };

  result.layerHierarchy = populateShapes(imageDef.shapes, result, createId);

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

  id = 0;
  result.animationHierarchy = populateAnimations(
    imageDef.animations,
    result,
    createId
  );

  return result;
};
