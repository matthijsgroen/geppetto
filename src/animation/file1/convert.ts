import {
  AnimationFrame,
  ImageDefinition,
  Keyframe,
  MutationVector,
} from "./types";
import {
  FrameAction,
  FrameControlAction,
  FrameEvent,
  GeppettoImage,
  TreeNode,
} from "../file2/types";
import { newFile } from "./new";
import { updateVersionNumber } from "../updateVersionNumber";

const convertMutations = (
  items: Record<string, TreeNode<string>>,
  children: string[] | undefined,
  source: GeppettoImage
): MutationVector[] => {
  if (children === undefined) {
    return [];
  }
  const result: MutationVector[] = [];
  for (const itemId of children) {
    const item = items[itemId];
    if (!item) continue;
    if (item.type === "mutation") {
      const mutation = source.mutations[itemId];
      result.push({
        ...mutation,
      });
    }
  }
  return result;
};

const convertShapes = (
  items: Record<string, TreeNode<string>>,
  source: GeppettoImage,
  target: ImageDefinition,
  parentId: string | null
): ImageDefinition["shapes"] => {
  const result: ImageDefinition["shapes"] = [];
  const parent = items[parentId === null ? "root" : parentId];

  for (const childId of parent?.children || []) {
    const item = items[childId];
    if (!item) continue;

    if (item.type === "layer") {
      const layer = source.layers[childId];
      result.push({
        name: layer.name,
        type: "sprite",
        mutationVectors: convertMutations(items, item.children, source),
        points: layer.points,
        translate: layer.translate,
      });
    }
    if (item.type === "layerFolder") {
      const folder = source.layerFolders[childId];
      result.push({
        name: folder.name,
        type: "folder",
        mutationVectors: convertMutations(items, item.children, source),
        items: convertShapes(items, source, target, childId),
      });
    }
  }
  return result;
};

const convertControls = (
  items: Record<string, TreeNode<string>>,
  source: GeppettoImage,
  target: ImageDefinition
) => {
  for (const [itemId, item] of Object.entries(items)) {
    if (item.type === "control") {
      const control = source.controls[itemId];

      target.controls.push({
        name: control.name,
        type: control.type,
        steps: control.steps.map((step) => {
          const result: Keyframe = {};
          for (const mutationId in step) {
            const mutationName = source.mutations[mutationId].name;
            result[mutationName] = step[mutationId];
          }
          return result;
        }),
      });
    }
  }
};

const isEventAction = (frame: FrameAction): frame is FrameEvent =>
  "event" in frame;

const isControlAction = (frame: FrameAction): frame is FrameControlAction =>
  "controlId" in frame;

const convertAnimations = (
  items: Record<string, TreeNode<string>>,
  source: GeppettoImage,
  target: ImageDefinition
) => {
  for (const [itemId, item] of Object.entries(items)) {
    if (item.type === "animation") {
      const animation = source.animations[itemId];

      const keyframes: AnimationFrame[] = [];

      for (const frameAction of animation.actions) {
        if (isEventAction(frameAction)) {
          const time = frameAction.start;
          const existing = keyframes.findIndex((v) => v.time === time);
          if (existing !== -1) {
            keyframes[existing].event = frameAction.event;
          } else {
            keyframes.push({
              time,
              controlValues: {},
              event: frameAction.event,
            });
          }
        } else if (isControlAction(frameAction)) {
          const time = frameAction.start + frameAction.duration;
          const existing = keyframes.findIndex((v) => v.time === time);
          const controlName = source.controls[frameAction.controlId].name;
          if (existing !== -1) {
            keyframes[existing].controlValues[controlName] =
              frameAction.controlValue;
          } else {
            keyframes.push({
              time,
              controlValues: {
                [controlName]: frameAction.controlValue,
              },
            });
          }
        }
      }

      target.animations.push({
        name: animation.name,
        looping: animation.looping,
        keyframes,
      });
    }
  }
};

export const convertFromV2 = (
  geppettoImage: GeppettoImage
): ImageDefinition => {
  const result: ImageDefinition = updateVersionNumber(newFile(), "1.1");

  result.shapes = convertShapes(
    geppettoImage.layerHierarchy,
    geppettoImage,
    result,
    null
  );
  convertControls(geppettoImage.controlHierarchy, geppettoImage, result);

  for (const controlId in geppettoImage.controlValues) {
    const controlName = geppettoImage.controls[controlId].name;
    const controlValue = geppettoImage.controlValues[controlId];
    result.controlValues[controlName] = controlValue;
  }
  for (const mutationId in geppettoImage.defaultFrame) {
    const mutationName = geppettoImage.mutations[mutationId].name;
    const mutationValue = geppettoImage.defaultFrame[mutationId];
    result.defaultFrame[mutationName] = mutationValue;
  }

  convertAnimations(geppettoImage.animationHierarchy, geppettoImage, result);

  return result;
};
