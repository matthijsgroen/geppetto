import produce from "immer";
import { Vec2 } from "../../types";
import {
  addInHierarchy,
  PlacementInfo,
  collectChildIds,
  isRootNode,
} from "./hierarchy";
import { GeppettoImage, Layer, LayerFolder, NodeType } from "./types";

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

export const addShape = (
  image: GeppettoImage,
  shapeName: string,
  position?: PlacementInfo
): [GeppettoImage, Layer, string] => {
  const newName = getUniqueName(shapeName, image.layers);
  const layer: Layer = {
    name: newName,
    visible: true,
    points: [],
    translate: [0, 0],
  };
  const [layerHierarchy, newId] = addInHierarchy(
    image.layerHierarchy,
    { type: "layer" },
    position
  );

  return [
    produce(image, (draft) => {
      draft.layerHierarchy = layerHierarchy;
      draft.layers[newId] = layer;
    }),
    layer,
    newId,
  ];
};

export type AddFolderDetails = { folder: LayerFolder; id: string };

export const addFolder = (
  image: GeppettoImage,
  folderName: string,
  position?: PlacementInfo,
  dataResult?: AddFolderDetails | {}
): GeppettoImage => {
  const newName = getUniqueName(folderName, image.layerFolders);
  const folder: LayerFolder = {
    name: newName,
    visible: true,
    collapsed: false,
  };
  const [layerHierarchy, newId] = addInHierarchy(
    image.layerHierarchy,
    { type: "layerFolder" },
    position
  );

  if (dataResult) {
    Object.assign(dataResult, {
      folder,
      id: newId,
    });
  }

  return produce(image, (draft) => {
    draft.layerHierarchy = layerHierarchy;
    draft.layerFolders[newId] = folder;
  });
};

type RenameableItems<O> = Pick<
  O,
  {
    [P in keyof O]: O[P] extends Record<string, { name: string }> ? P : never;
  }[keyof O]
>;

const typeToGroupKey: Record<NodeType, keyof RenameableItems<GeppettoImage>> = {
  layer: "layers",
  layerFolder: "layerFolders",
  mutation: "mutations",
};

export const rename = (
  image: GeppettoImage,
  itemId: string,
  itemType: NodeType,
  newName: string
): GeppettoImage => {
  const groupKey = typeToGroupKey[itemType];

  return produce(image, (draft) => {
    draft[groupKey][itemId].name = newName;
  });
};

export const addPoint = (
  image: GeppettoImage,
  layerId: string,
  point: Vec2
): GeppettoImage =>
  produce(image, (draft) => {
    draft.layers[layerId].points.push(point);
  });

export const deletePoint = (
  image: GeppettoImage,
  layerId: string,
  point: Vec2
): GeppettoImage =>
  produce(image, (draft) => {
    const array = draft.layers[layerId].points;
    const index = array.findIndex(
      (p) => p[0] === point[0] && p[1] === point[1]
    );
    if (index === -1) return;
    array.splice(index, 1);
  });

export const movePoint = (
  image: GeppettoImage,
  layerId: string,
  point: Vec2,
  newPoint: Vec2
) =>
  produce(image, (draft) => {
    const array = draft.layers[layerId].points;
    const index = array.findIndex(
      (p) => p[0] === point[0] && p[1] === point[1]
    );
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
        if (parent && parent.children) {
          const selfIndex = parent.children.indexOf(shapeId);
          if (selfIndex > -1) {
            parent.children.splice(selfIndex, 1);
          }
        }
      }
      delete draft.layerHierarchy[itemId];
    }
  });

export const hasPoints = (file: GeppettoImage) =>
  Object.values(file.layers).some((l) => l.points.length > 2);

export const toggleFolderVisibility = (itemId: string) =>
  produce<GeppettoImage>((draft) => {
    draft.layerFolders[itemId].visible = !draft.layerFolders[itemId].visible;
  });

export const toggleLayerVisibility = (itemId: string) =>
  produce<GeppettoImage>((draft) => {
    draft.layers[itemId].visible = !draft.layers[itemId].visible;
  });
