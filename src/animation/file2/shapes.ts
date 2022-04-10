import { addInHierarchy, PlacementInfo } from "./hierarchy";
import { GeppettoImage, Layer, LayerFolder, NodeType, TreeNode } from "./types";

const getNewShapeId = (image: GeppettoImage): string =>
  `${
    Math.max(
      ...Object.keys(image.mutations).map((n) => Number(n)),
      ...Object.keys(image.layers).map((n) => Number(n)),
      ...Object.keys(image.layerFolders).map((n) => Number(n)),
      -1
    ) + 1
  }`;

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
): [GeppettoImage, Layer] => {
  const newId = getNewShapeId(image);
  const newName = getUniqueName(shapeName, image.layers);
  const layer: Layer = {
    name: newName,
    visible: true,
    points: [],
    translate: [0, 0],
  };
  const newNode: TreeNode<"layer"> = { id: newId, type: "layer" };
  const layerHierarchy: TreeNode<NodeType>[] = addInHierarchy(
    image.layerHierarchy,
    newNode,
    position
  );
  console.log(newId, layer);

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
  ];
};

export const addFolder = (
  image: GeppettoImage,
  folderName: string,
  position?: PlacementInfo
): [GeppettoImage, LayerFolder] => {
  const newId = getNewShapeId(image);
  const newName = getUniqueName(folderName, image.layerFolders);
  const folder: LayerFolder = {
    name: newName,
    visible: true,
    collapsed: false,
  };
  const newNode: TreeNode<"layerFolder"> = { id: newId, type: "layerFolder" };
  const layerHierarchy: TreeNode<NodeType>[] = addInHierarchy(
    image.layerHierarchy,
    newNode,
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
  ];
};
