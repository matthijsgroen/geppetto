import { MutationVector } from "./types";

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
