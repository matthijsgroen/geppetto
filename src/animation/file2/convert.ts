import {
  AnimationFrame,
  ImageDefinition,
  MutationVector,
} from "../file1/types";
import { newFile } from "./new";
import { FrameAction, GeppettoImage, Hierarchy, NodeType } from "./types";

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
  result["root"] = { type: "root", children: ids };
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
): Hierarchy<"animationFolder" | "animation"> => {
  const result: Hierarchy<"animation"> = {};
  const ids: string[] = [];
  for (const animation of animations) {
    const id = createId();
    ids.push(id);
    result[id] = {
      type: "animation",
      parentId: "root",
    };

    target.animations[id] = {
      name: animation.name,
      looping: animation.looping,
      actions: convertKeyframes(animation.keyframes, target),
    };
  }
  result["root"] = { type: "root", children: ids };
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
    result.layerHierarchy,
    null
  );
  result.layerHierarchy["root"] = { type: "root", children: childIds };

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
