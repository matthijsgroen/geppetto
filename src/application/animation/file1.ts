import {
  AnimationFrame,
  ImageDefinition,
  Keyframe,
  MutationVector,
} from "./file1-types";
import {
  FrameAction,
  FrameControlAction,
  FrameEvent,
  GeppettoImage,
  TreeNode,
} from "./file2-types";

export const newFile = (): ImageDefinition => ({
  animations: [],
  controlValues: {},
  controls: [],
  defaultFrame: {},
  shapes: [],
  version: "1.0",
});

const convertMutations = (
  items: TreeNode<string>[],
  source: GeppettoImage
): MutationVector[] => {
  const result: MutationVector[] = [];
  for (const item of items) {
    if (item.type === "mutation") {
      const mutation = source.mutations[item.id];
      result.push({
        ...mutation,
      });
    }
  }
  return result;
};

const convertShapes = (
  items: TreeNode<string>[],
  source: GeppettoImage,
  target: ImageDefinition
): ImageDefinition["shapes"] => {
  const result: ImageDefinition["shapes"] = [];
  for (const item of items) {
    if (item.type === "layer") {
      const layer = source.layers[item.id];
      result.push({
        name: layer.name,
        type: "sprite",
        mutationVectors: convertMutations(
          (item.children || []).filter((i) => i.type === "mutation"),
          source
        ),
        points: layer.points,
        translate: layer.translate,
      });
    }
    if (item.type === "layerFolder") {
      const folder = source.layerFolders[item.id];
      result.push({
        name: folder.name,
        type: "folder",
        mutationVectors: convertMutations(
          (item.children || []).filter((i) => i.type === "mutation"),
          source
        ),
        items: convertShapes(
          (item.children || []).filter((i) => i.type !== "mutation"),
          source,
          target
        ),
      });
    }
  }
  return result;
};

const convertControls = (
  items: TreeNode<string>[],
  source: GeppettoImage,
  target: ImageDefinition
) => {
  for (const item of items) {
    if (item.type === "control") {
      const control = source.controls[item.id];

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
    if (item.children) {
      convertControls(item.children, source, target);
    }
  }
};

const isEventAction = (frame: FrameAction): frame is FrameEvent =>
  "event" in frame;

const isControlAction = (frame: FrameAction): frame is FrameControlAction =>
  "controlId" in frame;

const convertAnimations = (
  items: TreeNode<string>[],
  source: GeppettoImage,
  target: ImageDefinition
) => {
  for (const item of items) {
    if (item.type === "animation") {
      const animation = source.animations[item.id];

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
    if (item.children) {
      convertAnimations(item.children, source, target);
    }
  }
};

export const convertFromV2 = (
  geppettoImage: GeppettoImage
): ImageDefinition => {
  const result: ImageDefinition = { ...newFile(), version: "1.1" };

  result.shapes = convertShapes(
    geppettoImage.layerHierarchy,
    geppettoImage,
    result
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
