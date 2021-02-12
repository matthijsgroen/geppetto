import {
  FolderDefinition,
  ImageDefinition,
  ItemSelection,
  MutationVector,
  ShapeDefinition,
  SpriteDefinition,
  Vec2,
} from "./types";
import { isMutationVector, isShapeDefintion, visit } from "./visit";

export const newDefinition = (): ImageDefinition => ({
  shapes: [],
  controls: [],
});

export const getLayerNames = (layers: ShapeDefinition[]): string[] =>
  layers.reduce(
    (result, layer) =>
      layer.type === "folder"
        ? result.concat(layer.name, ...getLayerNames(layer.items))
        : result.concat(layer.name),
    [] as string[]
  );

export const vectorNamesFromShape = (shape: ShapeDefinition): string[] =>
  shape.mutationVectors.map((e) => e.name);

export const getVectorNames = (layers: ShapeDefinition[]): string[] =>
  layers.reduce(
    (result, layer) =>
      layer.type === "folder"
        ? result.concat(
            vectorNamesFromShape(layer),
            ...getVectorNames(layer.items)
          )
        : result.concat(vectorNamesFromShape(layer)),
    [] as string[]
  );

const makeItemName = (
  existingNames: string[],
  intendedName: string,
  previousName: string | null = null
) => {
  let counter = 0;
  const makeName = () =>
    counter === 0 ? intendedName : `${intendedName} (${counter})`;
  const names = existingNames.filter(
    (name) => !previousName || name !== previousName
  );
  while (names.includes(makeName())) {
    counter++;
  }
  return makeName();
};

export const makeLayerName = (
  image: ImageDefinition,
  intendedName: string,
  previousName: string | null = null
): string =>
  makeItemName(getLayerNames(image.shapes), intendedName, previousName);

export const makeVectorName = (
  image: ImageDefinition,
  intendedName: string,
  previousName: string | null = null
): string =>
  makeItemName(getVectorNames(image.shapes), intendedName, previousName);

export const addLayer = (
  mutator: (
    mutation: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ) => void,
  defaultName: string
): Promise<SpriteDefinition> =>
  new Promise((resolve) => {
    mutator((image) => {
      const newName = makeLayerName(image, defaultName);
      const newSprite: SpriteDefinition = {
        name: newName,
        type: "sprite",
        points: [],
        baseElementData: {},
        mutationVectors: [],
      };
      resolve(newSprite);

      return {
        ...image,
        shapes: ([newSprite] as ShapeDefinition[]).concat(image.shapes),
      };
    });
  });

export const addFolder = (
  mutator: (
    mutation: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ) => void,
  defaultName: string
): Promise<FolderDefinition> =>
  new Promise((resolve) => {
    mutator((image) => {
      const newName = makeLayerName(image, defaultName);
      const newFolder: FolderDefinition = {
        name: newName,
        type: "folder",
        items: [],
        mutationVectors: [],
      };

      resolve(newFolder);

      return {
        ...image,
        shapes: ([newFolder] as ShapeDefinition[]).concat(image.shapes),
      };
    });
  });

export const addVector = (
  mutator: (
    mutation: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ) => void,
  parent: ShapeDefinition,
  defaultName: string
): Promise<MutationVector> =>
  new Promise((resolve) => {
    mutator((image) => {
      const newName = makeVectorName(image, defaultName);
      const newVector: MutationVector = {
        name: newName,
        type: "translate",
        origin: [0, 0],
      };

      resolve(newVector);

      return visit(image, (item) =>
        isShapeDefintion(item) && item.name === parent.name
          ? {
              ...item,
              mutationVectors: ([newVector] as MutationVector[]).concat(
                item.mutationVectors || []
              ),
            }
          : undefined
      );
    });
  });

export const canMoveUp = (
  selectedItem: ItemSelection | null,
  image: ImageDefinition
): boolean => {
  if (selectedItem === null) {
    return false;
  }
  if (selectedItem.type === "layer") {
    return !(image.shapes[0].name === selectedItem.name);
  }
  // TODO: Implement for vector
  return false;
};

export const canDelete = (
  selectedItem: ItemSelection | null,
  image: ImageDefinition
): boolean => {
  if (selectedItem === null) {
    return false;
  }
  if (selectedItem.type === "layer") {
    const item = getShape(image, selectedItem.name);
    if (item?.type === "folder") {
      return item.items.length === 0;
    }
  }
  return true;
};

export const canMoveDown = (
  selectedItem: ItemSelection | null,
  image: ImageDefinition
): boolean => {
  if (selectedItem === null) {
    return false;
  }
  if (selectedItem.type === "layer") {
    return !(image.shapes[image.shapes.length - 1].name === selectedItem.name);
  }

  // TODO: Implement for vector
  return false;
};

const move = (
  moveDown: boolean,
  item: ItemSelection,
  shapes: ShapeDefinition[]
): ShapeDefinition[] =>
  shapes.reduce((result, shape, index, list) => {
    if (result.find((item) => item.name === shape.name)) {
      return result;
    }
    const lastAdded = result[result.length - 1];
    if (lastAdded && lastAdded.type === "folder") {
      const lastFolderItem = lastAdded.items[lastAdded.items.length - 1];
      if (lastFolderItem && lastFolderItem.name === shape.name) {
        return result;
      }
    }
    if (shape.name === item.name && item.type === "layer" && moveDown) {
      // get next item
      const next = list[index + 1];
      if (next) {
        if (next.type === "sprite") {
          return result.concat(next, shape);
        } else {
          return result.concat({
            ...next,
            items: [shape].concat(next.items),
          });
        }
      }
    }
    const next = list[index + 1];
    if (next && next.name === item.name && item.type === "layer" && !moveDown) {
      // get next item
      if (shape.type === "sprite") {
        return result.concat(next, shape);
      } else {
        return result.concat({
          ...shape,
          items: shape.items.concat(next),
        });
      }
    }
    if (shape.type === "folder") {
      if (moveDown) {
        const lastItem = shape.items[shape.items.length - 1];
        if (lastItem && lastItem.name === item.name && item.type === "layer") {
          // last item in the folder
          return result.concat(
            { ...shape, items: shape.items.slice(0, -1) },
            lastItem
          );
        }
      }
      if (!moveDown) {
        const firstItem = shape.items[0];
        if (
          firstItem &&
          firstItem.name === item.name &&
          item.type === "layer"
        ) {
          // last item in the folder
          return result.concat(firstItem, {
            ...shape,
            items: shape.items.slice(1),
          });
        }
      }
      return result.concat({
        ...shape,
        items: move(moveDown, item, shape.items),
      });
    }
    return result.concat(shape);
  }, [] as ShapeDefinition[]);

export const moveDown = (
  selectedItem: ItemSelection,
  image: ImageDefinition
): ImageDefinition => ({
  ...image,
  shapes: move(true, selectedItem, image.shapes),
});

export const moveUp = (
  selectedItem: ItemSelection,
  image: ImageDefinition
): ImageDefinition => ({
  ...image,
  shapes: move(false, selectedItem, image.shapes),
});

export const renameLayer = (
  image: ImageDefinition,
  currentName: string,
  newName: string
): ImageDefinition =>
  visit(image, (item) =>
    isShapeDefintion(item) && item.name === currentName
      ? { ...item, name: newName }
      : undefined
  );

export const renameVector = (
  image: ImageDefinition,
  currentName: string,
  newName: string
): ImageDefinition =>
  visit(image, (item) =>
    isMutationVector(item) && item.name === currentName
      ? { ...item, name: newName }
      : undefined
  );

const addRemovePointToShape = (
  shapes: ShapeDefinition[],
  layerName: string,
  point: Vec2,
  updateType: "add" | "remove"
): ShapeDefinition[] =>
  shapes.map((shape) =>
    shape.type === "folder"
      ? {
          ...shape,
          items: addRemovePointToShape(
            shape.items,
            layerName,
            point,
            updateType
          ),
        }
      : shape.name === layerName
      ? {
          ...shape,
          points:
            updateType === "add"
              ? shape.points.concat([point])
              : shape.points.filter(
                  (p) => p[0] !== point[0] || p[1] !== point[1]
                ),
        }
      : shape
  );

export const addPoint = (
  image: ImageDefinition,
  layer: string,
  point: Vec2
): ImageDefinition => ({
  ...image,
  shapes: addRemovePointToShape(image.shapes, layer, point, "add"),
});

export const removePoint = (
  image: ImageDefinition,
  layer: string,
  point: Vec2
): ImageDefinition => ({
  ...image,
  shapes: addRemovePointToShape(image.shapes, layer, point, "remove"),
});

export const getShape = (
  image: ImageDefinition,
  name: string
): ShapeDefinition | null => {
  let result = null;
  visit(image, (item) => {
    if (isShapeDefintion(item) && item.name === name) {
      result = item;
    }
    return undefined;
  });
  return result;
};

export const getVector = (
  image: ImageDefinition,
  name: string
): MutationVector | null => {
  let result = null;
  visit(image, (item) => {
    if (isMutationVector(item) && item.name === name) {
      result = item;
    }
    return undefined;
  });
  return result;
};

export const updateSpriteData = (
  imageDefinition: ImageDefinition,
  shapeName: string,
  mutation: (sprite: SpriteDefinition) => SpriteDefinition
): ImageDefinition =>
  visit(imageDefinition, (item) =>
    item.type === "sprite" && item.name === shapeName
      ? mutation(item)
      : undefined
  );

export const updateVectorData = (
  imageDefinition: ImageDefinition,
  vectorName: string,
  mutation: (vector: MutationVector) => MutationVector
): ImageDefinition =>
  visit(imageDefinition, (item) =>
    isMutationVector(item) && item.name === vectorName
      ? mutation(item)
      : undefined
  );

export const removeItem = (
  image: ImageDefinition,
  selectedItem: ItemSelection
): ImageDefinition =>
  visit(image, (item) =>
    ((selectedItem.type === "layer" && isShapeDefintion(item)) ||
      (selectedItem.type === "vector" && isMutationVector(item))) &&
    item.name === selectedItem.name
      ? false
      : undefined
  );
