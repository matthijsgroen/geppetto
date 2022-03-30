import {
  getLayerNames,
  getVectorNames,
  renameLayer,
  renameVector,
} from "./definitionHelpers";
import { ImageDefinition } from "../../animation/file1/types";

const NAME_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const nameForIndex = (number: number): string => {
  if (number >= NAME_CHARS.length) {
    return `${NAME_CHARS[number % NAME_CHARS.length]}${nameForIndex(
      Math.floor(number / NAME_CHARS.length)
    )}`;
  }
  return NAME_CHARS[number];
};

export const compressFile = (imageDef: ImageDefinition): ImageDefinition => {
  const layerNames = getLayerNames(imageDef.shapes);
  const vectorNames = getVectorNames(imageDef.shapes);

  const result = layerNames.reduce<ImageDefinition>(
    (result, name, index) => renameLayer(result, name, nameForIndex(index)),
    imageDef
  );

  return vectorNames.reduce<ImageDefinition>(
    (result, name, index) => renameVector(result, name, nameForIndex(index)),
    result
  );
};
