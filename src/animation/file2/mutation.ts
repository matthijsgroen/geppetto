import { Vec2 } from "geppetto-player";
import produce from "immer";
import { defaultValueForVector } from "../../application/webgl/lib/vertices";
import { addInHierarchy, PlacementInfo } from "./hierarchy";
import { getUniqueName } from "./shapes";
import {
  DeformationVector,
  GeppettoImage,
  MutationVector,
  ShapeMutationVector,
  TranslationVector,
} from "./types";

export const iconMapping: Record<MutationVector["type"], string> = {
  deform: "🟠",
  rotate: "🔴",
  stretch: "🟣",
  translate: "🟢",
  opacity: "⚪️",
  lightness: "⬜️",
  colorize: "🟧",
  saturation: "🟩",
};

export const mutationLabels: Record<MutationVector["type"], string> = {
  translate: "Translate",
  deform: "Deform",
  rotate: "Rotate",
  stretch: "Stretch",
  opacity: "Opacity",
  colorize: "Colorize",
  lightness: "Lightness",
  saturation: "Saturation",
};

export const hasRadius = (
  mutation: MutationVector
): mutation is TranslationVector | DeformationVector => "radius" in mutation;

type Mutation<T> = Extract<MutationVector, { type: T }>;

export const isShapeMutationVector = (
  vector: MutationVector
): vector is ShapeMutationVector =>
  vector.type === "deform" ||
  vector.type === "opacity" ||
  vector.type === "rotate" ||
  vector.type === "stretch" ||
  vector.type === "translate";

export type AddMutationDetails<T> = { mutation: Mutation<T>; id: string };
export type MutationSettings<MutationType> = Omit<
  Extract<MutationVector, { type: MutationType }>,
  "name" | "type" | "origin"
> & { origin?: Vec2 };

export const addMutation = <MutationType extends MutationVector["type"]>(
  file: GeppettoImage,
  name: string,
  mutationType: MutationType,
  setupProperties: MutationSettings<MutationType>,
  placement: PlacementInfo,
  dataResult?: AddMutationDetails<MutationType> | {}
): GeppettoImage => {
  const newName = getUniqueName(name, file.mutations);

  const mutation = {
    name: newName,
    type: mutationType,
    origin: [0, 0],
    ...setupProperties,
  };
  const [layerHierarchy, mutationId] = addInHierarchy(
    file.layerHierarchy,
    { type: "mutation" },
    placement
  );

  if (dataResult) {
    Object.assign(dataResult, {
      mutation,
      id: mutationId,
    });
  }
  return produce(file, (draft) => {
    draft.layerHierarchy = layerHierarchy;
    draft.mutations[mutationId] = mutation as unknown as MutationVector;
    draft.defaultFrame[mutationId] = defaultValueForVector(mutationType);
  });
};
