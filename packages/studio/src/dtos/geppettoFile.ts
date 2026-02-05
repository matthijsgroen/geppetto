import {
  type FileEntry,
  type FileReference,
  type GeppettoImage,
  type GeppettoImageParseError,
  readGep,
  writeGep,
} from "@geppetto/types";

import { verifyFile as verifyVersion1 } from "@/domain/animation/file1/verifyFile";
import { convertFromV1 } from "@/domain/animation/file2/convert";
import { verifyFile as verifyVersion2 } from "@/domain/animation/file2/verifyFile";

export const loadGeppettoFile = async (
  file: FileSystemFileHandle
): Promise<{
  filename: string;
  image: GeppettoImage;
  fileEntries: FileReference[];
  getFile(fileEntry: FileReference): ArrayBuffer;
}> => {
  const fileData = await file.getFile();
  if (file.name.endsWith(".gep")) {
    const arrayBuffer = await fileData.arrayBuffer();
    const { json, fileEntries, getFile } = readGep(arrayBuffer);
    return {
      filename: file.name,
      image: json,
      fileEntries,
      getFile,
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      try {
        const image = JSON.parse(reader.result as string);
        let error: GeppettoImageParseError | null = null;
        if (verifyVersion1(image)) {
          const version2 = convertFromV1(image);
          resolve({
            filename: file.name,
            image: version2,
            fileEntries: [],
            getFile: () => {
              throw new Error("Not implemented");
            },
          });
        } else if (
          verifyVersion2(image, (err) => {
            error = err;
          })
        ) {
          resolve({
            filename: file.name,
            image,
            fileEntries: [],
            getFile: () => {
              throw new Error("Not implemented");
            },
          });
        } else {
          console.warn("Validation error:", error);
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

export const imageToUint8Array = async (
  image: HTMLImageElement,
  format: "image/png" | "image/webp" = "image/png"
): Promise<Uint8Array> => {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");
  ctx.drawImage(image, 0, 0);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), format)
  );

  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
};

export const saveGeppettoFile = async (
  fileHandle: FileSystemFileHandle,
  image: GeppettoImage,
  files: FileEntry[] = []
): Promise<void> => {
  const writable = await fileHandle.createWritable();
  if (fileHandle.name.endsWith(".json")) {
    await writable.write(JSON.stringify(image));
  } else if (fileHandle.name.endsWith(".gep")) {
    await writable.write(await writeGep(image, files));
  } else {
    throw new Error("Unsupported file extension. Please use .json or .gep");
  }
  await writable.close();
};
