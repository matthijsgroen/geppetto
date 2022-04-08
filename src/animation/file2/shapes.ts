import { addAfter, addFirst } from "./hierarchy";
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

export const addShape = (
  image: GeppettoImage,
  shapeName: string,
  { after = undefined }: { after?: string } = {}
): [GeppettoImage, Layer] => {
  const newId = getNewShapeId(image);
  const layer: Layer = {
    name: shapeName,
    visible: true,
    points: [],
    translate: [0, 0],
  };
  const newNode: TreeNode<"layer"> = { id: newId, type: "layer" };
  const layerHierarchy: TreeNode<NodeType>[] = after
    ? addAfter(image.layerHierarchy, newNode, after)
    : addFirst(image.layerHierarchy, newNode);

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
  { after = undefined }: { after?: string } = {}
): [GeppettoImage, LayerFolder] => {
  const newId = getNewShapeId(image);
  const folder: LayerFolder = {
    name: folderName,
    visible: true,
    collapsed: false,
  };
  const newNode: TreeNode<"layerFolder"> = { id: newId, type: "layerFolder" };
  const layerHierarchy: TreeNode<NodeType>[] = after
    ? addAfter(image.layerHierarchy, newNode, after)
    : addFirst(image.layerHierarchy, newNode);

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
