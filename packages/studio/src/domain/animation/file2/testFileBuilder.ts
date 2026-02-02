import type {
  EasingFunction,
  GeppettoImage,
  MutationVector,
  Vec2,
} from "@geppetto/types";

import type { AddAnimationDetails } from "@/domain/animation/file2/animations";
import {
  addAnimation,
  addControlFrameToAnimation,
  renameAnimation,
} from "@/domain/animation/file2/animations";
import { chain } from "@/shared/utils/chain";
import type { TimeStamp } from "@/ui/components/atoms/TimePin/TimePin";

import { addControl } from "./controls";
import { addMutation, updateMutationValue } from "./mutation";
import { newFile } from "./new";
import type { AddShapeDetails } from "./shapes";
import { addFolder, addPoint, addShape } from "./shapes";

export const fileBuilder = () => {
  let file = newFile();
  let lastShapeId: null | string = null;
  let lastAnimationId: null | string = null;

  const builder = {
    addFolder: (name: string, parentName?: string) => {
      if (parentName !== undefined) {
        const parentId = Object.entries(file.layerFolders).find(
          ([, f]) => f.name === parentName
        );
        if (parentId) {
          file = addFolder(name, { parent: parentId[0] })(file);

          return builder;
        }
      }
      file = addFolder(name)(file);

      return builder;
    },
    addShape: (name: string, parentName?: string) => {
      if (parentName !== undefined) {
        const parentId = Object.entries(file.layerFolders).find(
          ([, f]) => f.name === parentName
        );
        if (parentId) {
          const result = {} as AddShapeDetails;
          file = addShape(name, { parent: parentId[0] }, result)(file);
          lastShapeId = result.id;

          return builder;
        }
      }
      const result = {} as AddShapeDetails;
      file = addShape(name, undefined, result)(file);
      lastShapeId = result.id;

      return builder;
    },
    addPoints: (points: Vec2[]) => {
      if (lastShapeId === null) {
        return builder;
      }
      for (const point of points) {
        file = addPoint(lastShapeId, point)(file);
      }
      return builder;
    },
    addMutation: <MutationType extends MutationVector["type"]>(
      name: string,
      type: MutationType,
      props: Omit<
        Extract<MutationVector, { type: MutationType }>,
        "name" | "type" | "origin"
      > & { origin?: Vec2 },
      parentName: string
    ) => {
      if (parentName !== undefined) {
        const folderParentId = Object.entries(file.layerFolders).find(
          ([, f]) => f.name === parentName
        );
        if (folderParentId) {
          const updated = addMutation(file, name, type, props, {
            parent: folderParentId[0],
          });
          file = updated;
          return builder;
        }
        const layerParentId = Object.entries(file.layers).find(
          ([, f]) => f.name === parentName
        );
        if (layerParentId) {
          file = addMutation(file, name, type, props, {
            parent: layerParentId[0],
          });
          return builder;
        }
      }

      return builder;
    },
    addControl: (name: string, parentName?: string) => {
      if (parentName !== undefined) {
        const parentId = Object.entries(file.controlFolders).find(
          ([, f]) => f.name === parentName
        );
        if (parentId) {
          file = addControl(name, { parent: parentId[0] })(file);

          return builder;
        }
      }
      file = addControl(name)(file);

      return builder;
    },
    setMutationValue: (name: string, value: Vec2) => {
      const mutId = getMutationIdByName(file, name);
      file = updateMutationValue(mutId, value)(file);

      return builder;
    },
    addAnimation: (name: string) => {
      const details: AddAnimationDetails | Record<string, never> = {};
      file = chain(
        () => addAnimation(details),
        () => renameAnimation(details.id, name)
      )(file);

      lastAnimationId = details.id;
      return builder;
    },
    addControlFrame: (
      controlName: string,
      start: TimeStamp,
      duration: TimeStamp,
      endValue: number,
      easing?: EasingFunction
    ) => {
      if (lastAnimationId === null) {
        return builder;
      }
      const controlId = getControlIdByName(file, controlName);
      file = addControlFrameToAnimation(
        lastAnimationId,
        controlId,
        start,
        duration,
        endValue,
        easing
      )(file);

      return builder;
    },
    build: () => file,
  };

  return builder;
};

export const getMutationIdByName = (
  file: GeppettoImage,
  name: string
): string => {
  const mut = Object.entries(file.mutations).find(([, m]) => m.name === name);
  return mut ? mut[0] : "NOT_FOUND";
};

export const getShapeIdByName = (file: GeppettoImage, name: string): string => {
  const layer = Object.entries(file.layers).find(([, m]) => m.name === name);
  return layer ? layer[0] : "NOT_FOUND";
};

export const getShapeFolderIdByName = (
  file: GeppettoImage,
  name: string
): string => {
  const layer = Object.entries(file.layerFolders).find(
    ([, m]) => m.name === name
  );
  return layer ? layer[0] : "NOT_FOUND";
};

export const getControlIdByName = (
  file: GeppettoImage,
  name: string
): string => {
  const control = Object.entries(file.controls).find(
    ([, m]) => m.name === name
  );
  return control ? control[0] : "NOT_FOUND";
};
