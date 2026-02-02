import type {
  DeformationVector,
  GeppettoImage,
  MutationVector,
  ShapeMutationVector,
  TranslationVector,
  Vec2,
} from "@geppetto/types";
import { produce } from "immer";

import { defaultValueForVector } from "@/infrastructure/webgl/lib/vertices";

import { addInHierarchy, type PlacementInfo } from "./hierarchy";
import { getUniqueName } from "./shapes";

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

export type AddMutationDetails<T> = {
  mutation: Mutation<T>;
  id: string;
};
export type MutationSettings<MutationType> = Omit<
  Extract<MutationVector, { type: MutationType }>,
  "name" | "type" | "origin"
> & { origin?: Vec2 };

export const hasMutations = (file: GeppettoImage): boolean =>
  Object.keys(file.mutations).length > 0;

export const addMutation = <MutationType extends MutationVector["type"]>(
  file: GeppettoImage,
  name: string,
  mutationType: MutationType,
  setupProperties: MutationSettings<MutationType>,
  placement: PlacementInfo,
  dataResult?: AddMutationDetails<MutationType> | Record<string, never>
): GeppettoImage => {
  const newName = getUniqueName(name, file.mutations);

  const mutation = {
    name: newName,
    type: mutationType,
    origin: [0, 0],
    ...(mutationType === "translate" || mutationType === "deform"
      ? { radius: -1 }
      : {}),
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

export const updateMutationValue = (itemId: string, newValue: Vec2) =>
  produce((draft) => {
    draft.defaultFrame[itemId] = newValue;
  });

export const updateMutationRadius = (itemId: string, newRadius: number) =>
  produce<GeppettoImage>((draft) => {
    const mutation = draft.mutations[itemId];
    if (hasRadius(mutation)) {
      mutation.radius = newRadius;
    }
  });

export const toggleMutationRadius = (itemId: string, useRadius: boolean) =>
  produce<GeppettoImage>((draft) => {
    const mutation = draft.mutations[itemId];
    if (hasRadius(mutation)) {
      mutation.radius = useRadius ? 10 : -1;
    }
  });

export const setMutationOrigin = (itemId: string, newOrigin: Vec2) =>
  produce<GeppettoImage>((draft) => {
    const mutation = draft.mutations[itemId];
    if (isShapeMutationVector(mutation)) {
      mutation.origin = newOrigin;
    }
  });
