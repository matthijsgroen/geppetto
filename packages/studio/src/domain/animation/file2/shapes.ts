import type {
  GeppettoImage,
  Layer,
  LayerFolder,
  NodeType,
  Vec2,
} from "@geppetto/types";
import { produce } from "immer";

import {
  addInHierarchy,
  collectChildIds,
  isRootNode,
  type PlacementInfo,
} from "./hierarchy";

export const getUniqueName = (
  name: string,
  existingItems: Record<string, { name: string }>
) => {
  const names = Object.values(existingItems).map((i) => i.name);
  if (!names.includes(name)) {
    return name;
  }
  let counter = 1;
  while (names.includes(`${name} (${counter})`)) {
    counter++;
  }
  return `${name} (${counter})`;
};

export type AddShapeDetails = {
  shape: Layer;
  id: string;
};

export const addShape = (
  shapeName: string,
  position?: PlacementInfo,
  dataResult?: AddShapeDetails | Record<string, never>
) =>
  produce<GeppettoImage>((draft) => {
    const newName = getUniqueName(shapeName, draft.layers);
    const layer: Layer = {
      name: newName,
      visible: true,
      points: [],
      translate: [0, 0],
    };
    const [layerHierarchy, newId] = addInHierarchy<NodeType>(
      draft.layerHierarchy,
      { type: "layer" },
      position
    );

    if (dataResult) {
      Object.assign(dataResult, { id: newId, layer });
    }

    draft.layerHierarchy = layerHierarchy;
    draft.layers[newId] = layer;
  });

export type AddFolderDetails = {
  folder: LayerFolder;
  id: string;
};

export const addFolder = (
  folderName: string,
  position?: PlacementInfo,
  dataResult?: AddFolderDetails | Record<string, never>
) =>
  produce<GeppettoImage>((draft) => {
    const newName = getUniqueName(folderName, draft.layerFolders);
    const folder: LayerFolder = {
      name: newName,
      visible: true,
      collapsed: false,
    };
    const [layerHierarchy, newId] = addInHierarchy<NodeType>(
      draft.layerHierarchy,
      { type: "layerFolder" },
      position
    );

    if (dataResult) {
      Object.assign(dataResult, {
        folder,
        id: newId,
      });
    }

    draft.layerHierarchy = layerHierarchy;
    draft.layerFolders[newId] = folder;
  });

type RenameableItems<O> = Pick<
  O,
  {
    [P in keyof O]: O[P] extends Record<string, { name: string }> ? P : never;
  }[keyof O]
>;

type HierarchyNodeTypes = NodeType | "control" | "controlFolder" | "animation";

const typeToGroupKey: Record<
  HierarchyNodeTypes,
  keyof RenameableItems<GeppettoImage>
> = {
  layer: "layers",
  layerFolder: "layerFolders",
  mutation: "mutations",
  control: "controls",
  controlFolder: "controlFolders",
  animation: "animations",
};

export const rename = (
  itemId: string,
  itemType: HierarchyNodeTypes,
  newName: string
) =>
  produce<GeppettoImage>((draft) => {
    const groupKey = typeToGroupKey[itemType];
    draft[groupKey][itemId].name = newName;
  });

export const addPoint = (layerId: string, point: Vec2) =>
  produce<GeppettoImage>((draft) => {
    draft.layers[layerId].points.push(point);
  });

export const deletePoint = (layerId: string, point: Vec2) =>
  produce<GeppettoImage>((draft) => {
    const array = draft.layers[layerId].points;
    const index = array.findIndex(
      (p) => p[0] === point[0] && p[1] === point[1]
    );
    if (index === -1) return;
    array.splice(index, 1);
  });

export const movePoint = (layerId: string, point: Vec2, newPoint: Vec2) =>
  produce<GeppettoImage>((draft) => {
    const array = draft.layers[layerId].points;
    const index = array.findIndex(
      (p) => p[0] === point[0] && p[1] === point[1]
    );
    if (index === -1) return;
    array[index] = newPoint;
  });

export const removeShape = (shapeId: string) =>
  produce<GeppettoImage>((draft) => {
    const affectedItems = collectChildIds(draft.layerHierarchy, shapeId).concat(
      shapeId
    );
    for (const itemId of affectedItems) {
      const item = draft.layerHierarchy[itemId];
      if (item.type === "layer") {
        delete draft.layers[itemId];
      }
      if (item.type === "mutation") {
        delete draft.mutations[itemId];
        delete draft.defaultFrame[itemId];
        Object.values(draft.controls).forEach((control) => {
          control.steps.forEach((step) => {
            delete step[itemId];
          });
        });
      }
      if (item.type === "layerFolder") {
        delete draft.layerFolders[itemId];
      }
      if (!isRootNode(item)) {
        const parent = draft.layerHierarchy[item.parentId];
        if (parent?.children) {
          const selfIndex = parent.children.indexOf(itemId);
          if (selfIndex > -1) {
            parent.children.splice(selfIndex, 1);
          }
        }
      }
      delete draft.layerHierarchy[itemId];
    }
  });

export const setLayerOffset = (layerId: string, offset: Vec2) =>
  produce<GeppettoImage>((draft) => {
    draft.layers[layerId].translate = offset;
  });

export const hasPoints = (file: GeppettoImage) =>
  Object.values(file.layers).some((l) => l.points.length > 2);

export const hasLayers = (file: GeppettoImage) =>
  Object.keys(file.layers).length > 0;

export const toggleVisibility = (itemId: string) =>
  produce((draft) => {
    const item = draft.layerHierarchy[itemId];
    if (item.type === "layer") {
      draft.layers[itemId].visible = !draft.layers[itemId].visible;
    }
    if (item.type === "layerFolder") {
      draft.layerFolders[itemId].visible = !draft.layerFolders[itemId].visible;
    }
  });
