import { DeformationVector, MutationVector, TranslationVector } from "./types";

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
