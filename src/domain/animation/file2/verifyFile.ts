import { type GeppettoImage } from "@/dtos/animation-file2.dto";

import { newFile } from "./new";

export const verifyFile = (file: unknown): file is GeppettoImage => {
  if (typeof file !== "object") return false;
  if (!file) return false;

  const fileKeys = Object.keys(newFile());
  if (!Object.keys(file).every((k) => fileKeys.includes(k))) return false;

  return (file as GeppettoImage).version.startsWith("2.");
};
