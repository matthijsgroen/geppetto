import { newFile } from "./new";
import { ImageDefinition } from "./types";

export const verifyFile = (file: unknown): file is ImageDefinition => {
  if (typeof file !== "object") return false;
  if (!file) return false;

  const fileKeys = Object.keys(newFile());
  if (!Object.keys(file).every((k) => fileKeys.includes(k))) return false;

  return (file as ImageDefinition).version.startsWith("1.");
};
