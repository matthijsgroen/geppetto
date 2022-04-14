import { addInHierarchy, PlacementInfo } from "./hierarchy";
import { GeppettoImage, Layer, LayerFolder, NodeType } from "./types";

const getUniqueName = (
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
    {
      ...image,
      layerHierarchy,
      layers: {
        ...image.layers,
        [newId]: layer,
      },
    },
    layer,
    newId,
  ];
};

export const addFolder = (
  image: GeppettoImage,
  folderName: string,
  position?: PlacementInfo
): [GeppettoImage, LayerFolder, string] => {
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

  return [
    {
      ...image,
      layerHierarchy,
      layerFolders: {
        ...image.layerFolders,
        [newId]: folder,
      },
    },
    folder,
    newId,
  ];
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

  return {
    ...image,
    [groupKey]: {
      ...image[groupKey],
      [itemId]: { ...image[groupKey][itemId], name: newName },
    },
  };
};