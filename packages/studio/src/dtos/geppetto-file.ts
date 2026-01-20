import type { GeppettoImage } from "@geppetto/types";

import { verifyFile as verifyVersion1 } from "@/domain/animation/file1/verifyFile";
import { convertFromV1 } from "@/domain/animation/file2/convert";
import { verifyFile as verifyVersion2 } from "@/domain/animation/file2/verifyFile";

export const loadGeppettoFile = async (
  file: FileSystemFileHandle
): Promise<[filename: string, image: GeppettoImage]> => {
  const fileData = await file.getFile();
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const image = JSON.parse(reader.result as string);
      if (verifyVersion1(image)) {
        const version2 = convertFromV1(image);
        resolve([file.name, version2]);
      }
      if (verifyVersion2(image)) {
        resolve([file.name, image]);
      }
    });
    reader.readAsText(fileData, "utf8");
  });
};

export const saveGeppettoFile = async (
  fileHandle: FileSystemFileHandle,
  image: GeppettoImage
): Promise<void> => {
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(image));
  await writable.close();
};
