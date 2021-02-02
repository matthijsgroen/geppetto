import {
  FolderDefinition,
  ImageDefinition,
  ShapeDefinition,
  SpriteDefinition,
} from "./types";

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

export const addLayer = (
  mutator: (
    mutation: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ) => void,
  defaultName: string
): Promise<string> => {
  let counter = 0;
  const makeName = () =>
    counter === 0 ? defaultName : `${defaultName} (${counter})`;
  return new Promise((resolve) => {
    mutator((image) => {
      const names = getLayerNames(image.shapes);
      while (names.includes(makeName())) {
        counter++;
      }
      resolve(makeName());

      return {
        ...image,
        shapes: ([
          {
            name: makeName(),
            type: "sprite",
            points: [],
            baseElementData: {},
          } as SpriteDefinition,
        ] as ShapeDefinition[]).concat(image.shapes),
      };
    });
  });
};

export const addFolder = (
  mutator: (
    mutation: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ) => void,
  defaultName: string
): Promise<string> => {
  let counter = 0;
  const makeName = () =>
    counter === 0 ? defaultName : `${defaultName} (${counter})`;
  return new Promise((resolve) => {
    mutator((image) => {
      const names = getLayerNames(image.shapes);
      while (names.includes(makeName())) {
        counter++;
      }
      resolve(makeName());

      return {
        ...image,
        shapes: ([
          {
            name: makeName(),
            type: "folder",
            items: [],
          } as FolderDefinition,
        ] as ShapeDefinition[]).concat(image.shapes),
      };
    });
  });
};

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
