import { newDefinition } from "../definitionHelpers";
import {
  FolderDefinition,
  ImageDefinition,
  MutationVector,
  ShapeDefinition,
  SpriteDefinition,
} from "../types";
import { Folder, GeppettoImage, Layer } from "./types";

export const newFile = (): GeppettoImage => ({
  version: "2.0",
  layerHierarchy: [],
  layers: [],
  layersHidden: [],
  names: {},
  mutations: [],
  defaultFrame: {},
  controls: [],
  controlValues: {},
  animations: [],
  animationHierarchy: [],
});

const placeName = (result: GeppettoImage, name: string): string => {
  let id = 0;
  for (const takenId in result.names) {
    if (`${id}` === takenId) {
      id++;
    } else break;
  }
  result.names[id] = name;
  return `${id}`;
};

const getMutationId = (result: GeppettoImage, name: string): string => {
  const mutationIds = result.mutations.map((m) => m.id);
  for (const takenId of mutationIds) {
    if (result.names[takenId] === name) return takenId;
  }
  throw new Error(`Name "${name}" not found`);
};

const getControlId = (result: GeppettoImage, name: string): string => {
  const controlIds = result.controls.map((m) => m.id);
  for (const takenId of controlIds) {
    if (result.names[takenId] === name) return takenId;
  }
  throw new Error(`Name "${name}" not found`);
};

const populateMutations = (
  parentId: string,
  mutations: MutationVector[],
  result: GeppettoImage
) => {
  for (const mutation of mutations) {
    const id = placeName(result, mutation.name);
    result.mutations.push({
      id,
      parent: parentId,
      type: mutation.type,
      origin: mutation.origin,
    });
  }
};

const populateShapes = (
  shapes: ImageDefinition["shapes"],
  result: GeppettoImage
): string[] => {
  const ids: string[] = [];
  for (const shape of shapes) {
    if (shape.type === "folder") {
      const id = placeName(result, shape.name);
      ids.push(id);
      result.layerHierarchy.push({
        id,
        collapsed: false,
        children: populateShapes(shape.items, result),
      });
      populateMutations(id, shape.mutationVectors, result);
    } else {
      const id = placeName(result, shape.name);
      ids.push(id);
      result.layers.push({
        id,
        points: shape.points,
        translate: shape.translate,
      });
      populateMutations(id, shape.mutationVectors, result);
    }
  }
  return ids;
};

const populateControls = (
  controls: ImageDefinition["controls"],
  result: GeppettoImage
) => {
  for (const control of controls) {
    const id = placeName(result, control.name);
    result.controls.push({
      id,
      type: control.type,
      steps: control.steps.map((step) =>
        Object.entries(step).reduce(
          (map, [key, value]) => ({
            ...map,
            [getMutationId(result, key)]: value,
          }),
          {}
        )
      ),
    });
  }
};

export const convertv1tov2 = (imageDef: ImageDefinition): GeppettoImage => {
  const result: GeppettoImage = newFile();
  populateShapes(imageDef.shapes, result);
  populateControls(imageDef.controls, result);

  for (const key in imageDef.controlValues) {
    const value = imageDef.controlValues[key];
    const id = getControlId(result, key);
    result.controlValues[id] = value;
  }
  for (const key in imageDef.defaultFrame) {
    const value = imageDef.defaultFrame[key];
    const id = getMutationId(result, key);
    result.defaultFrame[id] = value;
  }

  return result;
};

const createShape = (
  geppettoImage: GeppettoImage,
  layer: Layer
): SpriteDefinition => ({
  name: geppettoImage.names[layer.id],
  type: "sprite",
  mutationVectors: geppettoImage.mutations
    .filter((m) => m.parent === layer.id)
    .map(
      (mutation) =>
        ({
          name: geppettoImage.names[mutation.id],
          type: mutation.type,
          origin: mutation.origin,
        } as MutationVector)
    ),
  points: layer.points,
  translate: layer.translate,
});

const createFolder = (
  geppettoImage: GeppettoImage,
  folder: Folder
): FolderDefinition => ({
  name: geppettoImage.names[folder.id],
  type: "folder",
  mutationVectors: geppettoImage.mutations
    .filter((m) => m.parent === folder.id)
    .map(
      (mutation) =>
        ({
          name: geppettoImage.names[mutation.id],
          type: mutation.type,
          origin: mutation.origin,
        } as MutationVector)
    ),
  items: folder.children.map((childId) => {
    const isFolder = geppettoImage.layerHierarchy.find((f) => f.id === childId);
    if (isFolder) {
      return createFolder(geppettoImage, isFolder);
    }
    const isLayer = geppettoImage.layers.find((f) => f.id === childId);
    if (!isLayer) {
      throw new Error(`layer "${childId}" not found`);
    }
    return createShape(geppettoImage, isLayer);
  }),
});

const getTopLevelFolder = (
  geppettoImage: GeppettoImage,
  id: string
): Folder | undefined => {
  const folder = geppettoImage.layerHierarchy.find((item) =>
    item.children.includes(id)
  );
  if (folder) {
    return getTopLevelFolder(geppettoImage, folder.id) || folder;
  }
  return undefined;
};

export const convertv2tov1 = (
  geppettoImage: GeppettoImage
): ImageDefinition => {
  const result = { ...newDefinition(), version: "1.1" };

  result.shapes = geppettoImage.layers.reduce((result, layer) => {
    const folder = getTopLevelFolder(geppettoImage, layer.id);
    if (folder) {
      const folderName = geppettoImage.names[folder.id];
      if (
        result.some(
          (item) => item.type === "folder" && item.name === folderName
        )
      )
        return result;
      return result.concat(createFolder(geppettoImage, folder));
    }
    return result.concat(createShape(geppettoImage, layer));
  }, [] as ShapeDefinition[]);

  for (const control of geppettoImage.controls) {
    result.controls.push({
      name: geppettoImage.names[control.id],
      type: control.type,
      steps: control.steps.map((step) =>
        Object.entries(step).reduce(
          (r, [k, n]) => ({ ...r, [geppettoImage.names[k]]: n }),
          {}
        )
      ),
    });
  }

  for (const [key, value] of Object.entries(geppettoImage.controlValues)) {
    result.controlValues[geppettoImage.names[key]] = value;
  }
  for (const [key, value] of Object.entries(geppettoImage.defaultFrame)) {
    result.defaultFrame[geppettoImage.names[key]] = value;
  }

  return result;
};
