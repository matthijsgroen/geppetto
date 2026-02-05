import { GEP_MAGIC, HEADER_SIZE } from "./common";
import { GeppettoImage, GeppettoImageWithFiles } from "./image";

export const writeGep = async (
  json: GeppettoImage,
  files: { name: string; mime: string; data: Uint8Array }[]
): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();

  const clone: GeppettoImageWithFiles = { ...json, fileEntries: [] };
  let currentOffset = 0;
  for (const file of files) {
    clone.fileEntries.push({
      name: file.name,
      mime: file.mime,
      offset: currentOffset,
      length: file.data.byteLength,
    });
    currentOffset += file.data.byteLength;
  }

  const jsonBytes = encoder.encode(JSON.stringify(clone));

  const binLength = files.reduce((s, b) => s + b.data.byteLength, 0);

  const jsonOffset = HEADER_SIZE;
  const binOffset = jsonOffset + jsonBytes.byteLength;
  const totalSize = binOffset + binLength;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const u8 = new Uint8Array(buffer);

  // ---- Header ----
  for (let i = 0; i < 4; i++) {
    view.setUint8(i, GEP_MAGIC.charCodeAt(i));
  }

  view.setUint32(4, totalSize, true);
  view.setUint32(8, jsonOffset, true);
  view.setUint32(12, jsonBytes.byteLength, true);
  view.setUint32(16, binOffset, true);
  view.setUint32(20, binLength, true);
  // bytes 24–31 reserved = 0

  // ---- JSON chunk ----
  u8.set(jsonBytes, jsonOffset);

  // ---- BIN chunk ----
  let ptr = binOffset;
  for (const blob of files) {
    u8.set(blob.data, ptr);
    ptr += blob.data.byteLength;
  }

  return buffer;
};
