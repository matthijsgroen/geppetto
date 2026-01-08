import type {
  Animation,
  FrameAction,
  FrameControlAction,
  GeppettoImage,
  Hierarchy,
} from "@geppetto/types";

import { updateVersionNumber } from "@/domain/versioning/updateVersionNumber";
import {
  type AnimationFrame,
  type ImageDefinition,
  type Keyframe,
  type MutationVector,
} from "@/dtos/animation-file1.dto";

import { newFile } from "./new";

const convertMutations = (
  items: Hierarchy<string>,
  children: string[] | undefined,
  source: GeppettoImage
): MutationVector[] => {
  if (children === undefined) {
    return [];
  }
  const result: MutationVector[] = [];
  for (const itemId of children) {
    const item = items[itemId];
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
  items: Hierarchy<string>,
  source: GeppettoImage,
  target: ImageDefinition,
  parentId: string | null
): ImageDefinition["shapes"] => {
  const result: ImageDefinition["shapes"] = [];
  const parent = items[parentId === null ? "root" : parentId];

  for (const childId of parent?.children || []) {
    const item = items[childId];

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
  items: Hierarchy<string>,
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

const isControlAction = (frame: FrameAction): frame is FrameControlAction =>
  "controlEndValue" in frame;

const convertAnimations = (
  animations: Record<string, Animation>,
  source: GeppettoImage,
  target: ImageDefinition
) => {
  for (const animation of Object.values(animations)) {
    const keyframes: AnimationFrame[] = [];

    for (const frameEvent of animation.events) {
      const time = frameEvent.start;
      const existing = keyframes.findIndex((v) => v.time === time);
      if (existing !== -1) {
        keyframes[existing].event = frameEvent.eventName;
      } else {
        keyframes.push({
          time,
          controlValues: {},
          event: frameEvent.eventName,
        });
      }
    }

    for (const track of animation.tracks) {
      if (track.type !== "control") {
        continue;
      }
      for (const frameAction of track.actions) {
        if (isControlAction(frameAction)) {
          const endTime = frameAction.start + frameAction.duration;
          const existingEnd = keyframes.findIndex((v) => v.time === endTime);
          const controlName = source.controls[track.controlId].name;
          if (frameAction.controlStartValue !== undefined) {
            const existingStart = keyframes.findIndex(
              (v) => v.time === frameAction.start
            );
            if (existingStart !== -1) {
              keyframes[existingStart].controlValues[controlName] =
                frameAction.controlStartValue;
            } else {
              keyframes.push({
                time: frameAction.start,
                controlValues: {
                  [controlName]: frameAction.controlStartValue,
                },
              });
            }
          }
          if (existingEnd !== -1) {
            keyframes[existingEnd].controlValues[controlName] =
              frameAction.controlEndValue;
          } else {
            keyframes.push({
              time: endTime,
              controlValues: {
                [controlName]: frameAction.controlEndValue,
              },
            });
          }
        }
      }
    }

    target.animations.push({
      name: animation.name,
      looping: animation.looping,
      keyframes: keyframes.toSorted((a, b) => a.time - b.time),
    });
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

  convertAnimations(geppettoImage.animations, geppettoImage, result);

  return result;
};
