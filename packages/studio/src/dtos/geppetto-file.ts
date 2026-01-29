import type { GeppettoImage, GeppettoImageParseError } from "@geppetto/types";

import { verifyFile as verifyVersion1 } from "@/domain/animation/file1/verifyFile";
import { convertFromV1 } from "@/domain/animation/file2/convert";
import { verifyFile as verifyVersion2 } from "@/domain/animation/file2/verifyFile";

export const loadGeppettoFile = async (
  file: FileSystemFileHandle
): Promise<[filename: string, image: GeppettoImage]> => {
  const fileData = await file.getFile();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      try {
        const image = JSON.parse(reader.result as string);
        let error: GeppettoImageParseError | null = null;
        if (verifyVersion1(image)) {
          const version2 = convertFromV1(image);
          resolve([file.name, version2]);
        } else if (
          verifyVersion2(image, (err) => {
            error = err;
          })
        ) {
          resolve([file.name, image]);
        } else {
          console.log("Validation error:", error);
          reject(
            new Error(
              `Unsupported file format or invalid file structure. Please check that this is a valid Geppetto animation file.`
            )
          );
        }
      } catch (error) {
        reject(
          new Error(
            `Failed to parse JSON file: ${error instanceof Error ? error.message : "Unknown error"}`
          )
        );
      }
    });

    reader.addEventListener("error", () => {
      reject(new Error(`Failed to read file: ${file.name}`));
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
