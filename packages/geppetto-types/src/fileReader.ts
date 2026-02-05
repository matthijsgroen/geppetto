import { GEP_MAGIC } from "./common";
import { FileReference } from "./fileEntry";
import { GeppettoImage } from "./image";

export const readGep = (
  buffer: ArrayBuffer
): {
  json: GeppettoImage;
  fileEntries: FileReference[];
  getFile(fileEntry: FileReference): ArrayBuffer;
} => {
  const view = new DataView(buffer);
  const u8 = new Uint8Array(buffer);

  const magic = String.fromCharCode(u8[0], u8[1], u8[2], u8[3]);

  if (magic !== GEP_MAGIC) {
    throw new Error("Invalid GEP file");
  }

  const jsonOffset = view.getUint32(8, true);
  const jsonLength = view.getUint32(12, true);
  const binOffset = view.getUint32(16, true);

  const jsonBytes = u8.slice(jsonOffset, jsonOffset + jsonLength);
  const json = JSON.parse(new TextDecoder().decode(jsonBytes));
  const fileEntries: FileReference[] = json.fileEntries || [];

  // Remove fileEntries if present
  if (json && typeof json === "object" && "fileEntries" in json) {
    delete json.fileEntries;
  }
  return {
    json,
    fileEntries,
    getFile(fileEntry: FileReference) {
      return buffer.slice(
        binOffset + fileEntry.offset,
        binOffset + fileEntry.offset + fileEntry.length
      );
    },
  };
};
