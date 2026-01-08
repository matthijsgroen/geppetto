import { type ImageDefinition } from "@/dtos/animation-file1.dto";

import { newFile } from "./new";

export const verifyFile = (file: unknown): file is ImageDefinition => {
  if (typeof file !== "object") return false;
  if (!file) return false;

  const fileKeys = Object.keys(newFile());
  if (!Object.keys(file).every((k) => fileKeys.includes(k))) return false;

  if (!("version" in file)) return true; // older files may not have version

  return (file as ImageDefinition).version.startsWith("1.");
};
