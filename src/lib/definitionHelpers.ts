import {
  ControlDefinition,
  FolderDefinition,
  ImageDefinition,
  Keyframe,
  ShapeDefinition,
  SpriteDefinition,
  Vec2,
} from "./types";

export const newDefinition = (): ImageDefinition => ({
  shapes: [],
  controls: [],
});

const getLayerNames = (layers: ShapeDefinition[]): string[] =>
  layers.reduce(
    (result, layer) =>
      layer.type === "folder"
        ? result.concat(layer.name, ...getLayerNames(layer.items))
        : result.concat(layer.name),
    [] as string[]
  );

export const makeLayerName = (
  image: ImageDefinition,
  intendedName: string,
  previousName: string | null = null
): string => {
  let counter = 0;
  const makeName = () =>
    counter === 0 ? intendedName : `${intendedName} (${counter})`;
  const names = getLayerNames(image.shapes).filter(
    (name) => !previousName || name !== previousName
  );
  while (names.includes(makeName())) {
    counter++;
  }
  return makeName();
};

export const addLayer = (
  mutator: (
    mutation: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ) => void,
  defaultName: string
): Promise<string> =>
  new Promise((resolve) => {
    mutator((image) => {
      const newName = makeLayerName(image, defaultName);
      resolve(newName);

      return {
        ...image,
        shapes: ([
          {
            name: newName,
            type: "sprite",
            points: [],
            baseElementData: {},
          } as SpriteDefinition,
        ] as ShapeDefinition[]).concat(image.shapes),
      };
    });
  });

export const addFolder = (
  mutator: (
    mutation: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ) => void,
  defaultName: string
): Promise<string> =>
  new Promise((resolve) => {
    mutator((image) => {
      const newName = makeLayerName(image, defaultName);
      resolve(newName);

      return {
        ...image,
        shapes: ([
          {
            name: newName,
            type: "folder",
            items: [],
          } as FolderDefinition,
        ] as ShapeDefinition[]).concat(image.shapes),
      };
    });
  });

export const canMoveUp = (
  selectedItem: string | null,
  image: ImageDefinition
): boolean => {
  if (selectedItem === null) {
    return false;
  }
  return !(image.shapes[0].name === selectedItem);
};

export const canMoveDown = (
  selectedItem: string | null,
  image: ImageDefinition
): boolean => {
  if (selectedItem === null) {
    return false;
  }
  return !(image.shapes[image.shapes.length - 1].name === selectedItem);
};

const move = (
  moveDown: boolean,
  itemName: string,
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
    if (shape.name === itemName && moveDown) {
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
    if (next && next.name === itemName && !moveDown) {
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
        if (lastItem && lastItem.name === itemName) {
          // last item in the folder
          return result.concat(
            { ...shape, items: shape.items.slice(0, -1) },
            lastItem
          );
        }
      }
      if (!moveDown) {
        const firstItem = shape.items[0];
        if (firstItem && firstItem.name === itemName) {
          // last item in the folder
          return result.concat(firstItem, {
            ...shape,
            items: shape.items.slice(1),
          });
        }
      }
      return result.concat({
        ...shape,
        items: move(moveDown, itemName, shape.items),
      });
    }
    return result.concat(shape);
  }, [] as ShapeDefinition[]);

export const moveDown = (
  selectedItem: string,
  image: ImageDefinition
): ImageDefinition => ({
  ...image,
  shapes: move(true, selectedItem, image.shapes),
});

export const moveUp = (
  selectedItem: string,
  image: ImageDefinition
): ImageDefinition => ({
  ...image,
  shapes: move(false, selectedItem, image.shapes),
});

const renameShape = (
  shapes: ShapeDefinition[],
  currentName: string,
  newName: string
): ShapeDefinition[] =>
  shapes.reduce(
    (result, shape) =>
      shape.name === currentName
        ? result.concat({ ...shape, name: newName })
        : shape.type === "folder"
        ? result.concat({
            ...shape,
            items: renameShape(shape.items, currentName, newName),
          })
        : result.concat(shape),
    [] as ShapeDefinition[]
  );

const renameKeyframe = (
  frame: Keyframe,
  currentName: string,
  newName: string
) =>
  Object.entries(frame).reduce(
    (result, [key, data]) =>
      key === currentName
        ? {
            ...result,
            [newName]: data,
          }
        : {
            ...result,
            [key]: data,
          },
    {} as Keyframe
  );

const renameControlShape = (
  controls: ControlDefinition[],
  currentName: string,
  newName: string
) =>
  controls.map((control) => ({
    ...control,
    min: renameKeyframe(control.min, currentName, newName),
    max: renameKeyframe(control.max, currentName, newName),
  }));

export const rename = (
  image: ImageDefinition,
  currentName: string,
  newName: string
): ImageDefinition => ({
  ...image,
  shapes: renameShape(image.shapes, currentName, newName),
  controls: renameControlShape(image.controls, currentName, newName),
});

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
  items: ShapeDefinition[],
  layer: string
): ShapeDefinition | null =>
  items.reduce<ShapeDefinition | null>(
    (result, item) =>
      result
        ? result
        : item.name === layer
        ? item
        : item.type === "folder"
        ? getShape(item.items, layer)
        : result,
    null
  );
