import { Vec2 } from "geppetto-player";
import produce from "immer";
import { addInHierarchy, PlacementInfo } from "./hierarchy";
import { getUniqueName } from "./shapes";
import {
  DeformationVector,
  GeppettoImage,
  MutationVector,
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

export const hasRadius = (
  mutation: MutationVector
): mutation is TranslationVector | DeformationVector => "radius" in mutation;

type Mutation<T> = Extract<MutationVector, { type: T }>;

export const addMutation = <MutationType extends MutationVector["type"]>(
  file: GeppettoImage,
  name: string,
  mutationType: MutationType,
  setupProperties: Omit<
    Extract<MutationVector, { type: MutationType }>,
    "name" | "type" | "origin"
  > & { origin?: Vec2 },
  placement: PlacementInfo
): [GeppettoImage, Mutation<MutationType>, string] => {
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

  return [
    produce(file, (draft) => {
      draft.layerHierarchy = layerHierarchy;
      draft.mutations[mutationId] = mutation as unknown as MutationVector;
    }),
    mutation as Mutation<typeof mutationType>,
    mutationId,
  ];
};
