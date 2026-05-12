import { describe, expect, it } from "vitest";
import { newFile } from "./testHelpers";
import { writeGep } from "./fileWriter";
import { readGep } from "./fileReader";

const setMagic = (view: DataView) =>
  "GEP1".split("").forEach((c, i) => view.setUint8(i, c.charCodeAt(0)));

describe("File Reader", () => {
  it("returns the geppetto image", async () => {
    const image = newFile();
    const fileData = new Uint8Array([1, 2, 3, 4]);
    const arrayBuffer = await writeGep(image, [
      { name: "test.bin", mime: "application/octet-stream", data: fileData },
    ]);

    const { json, fileEntries, getFile } = readGep(arrayBuffer);

    expect(json).toEqual(image);
    expect(fileEntries.length).toBe(1);
    expect(fileEntries[0].name).toBe("test.bin");
    expect(fileEntries[0].mime).toBe("application/octet-stream");

    const extractedFile = new Uint8Array(getFile(fileEntries[0]));
    expect(extractedFile).toEqual(fileData);
  });

  it("throws when buffer is shorter than 4 bytes", () => {
    expect(() => readGep(new ArrayBuffer(3))).toThrow("Invalid GEP file");
  });

  it("throws when magic number is invalid", () => {
    const buf = new ArrayBuffer(4);
    new DataView(buf).setUint32(0, 0x12345678, true);
    expect(() => readGep(buf)).toThrow("Invalid GEP file");
  });

  it("throws when buffer is shorter than the header size", () => {
    const buf = new ArrayBuffer(8); // valid magic but only 8 of 32 header bytes
    setMagic(new DataView(buf));
    expect(() => readGep(buf)).toThrow("Invalid GEP file");
  });

  it("throws when json section extends past end of buffer", () => {
    const buf = new ArrayBuffer(40);
    const view = new DataView(buf);
    setMagic(view);
    view.setUint32(8, 32, true);  // jsonOffset = 32
    view.setUint32(12, 100, true); // jsonLength = 100 → 32+100=132 > 40
    view.setUint32(16, 36, true);  // binOffset within buffer
    expect(() => readGep(buf)).toThrow("Invalid GEP file");
  });

  it("throws when bin section starts past end of buffer", () => {
    const buf = new ArrayBuffer(40);
    const view = new DataView(buf);
    setMagic(view);
    view.setUint32(8, 32, true);  // jsonOffset = 32
    view.setUint32(12, 4, true);  // jsonLength = 4 → 32+4=36 ≤ 40 ✓
    view.setUint32(16, 100, true); // binOffset = 100 > 40
    expect(() => readGep(buf)).toThrow("Invalid GEP file");
  });

  it("returns empty fileEntries when json has no fileEntries field", async () => {
    // Simulate an older file format where fileEntries is absent from the JSON
    const image = newFile();
    const fullBuffer = await writeGep(image, []);
    // Overwrite the JSON section with a payload that has no fileEntries key
    const view = new DataView(fullBuffer);
    const jsonOffset = view.getUint32(8, true);
    const encoder = new TextEncoder();
    const patchedJson = encoder.encode(JSON.stringify(image)); // no fileEntries key
    const patchedLength = patchedJson.byteLength;
    const binOffset = jsonOffset + patchedLength;
    const totalSize = binOffset;
    const patchedBuffer = new ArrayBuffer(totalSize);
    const patchedView = new DataView(patchedBuffer);
    const patchedU8 = new Uint8Array(patchedBuffer);
    setMagic(patchedView);
    patchedView.setUint32(4, totalSize, true);
    patchedView.setUint32(8, jsonOffset, true);
    patchedView.setUint32(12, patchedLength, true);
    patchedView.setUint32(16, binOffset, true);
    patchedView.setUint32(20, 0, true);
    patchedU8.set(patchedJson, jsonOffset);

    const { fileEntries } = readGep(patchedBuffer);
    expect(fileEntries).toEqual([]);
  });

  it("throws when a file entry extends past end of buffer", async () => {
    const image = newFile();
    const fileData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const fullBuffer = await writeGep(image, [
      { name: "test.bin", mime: "application/octet-stream", data: fileData },
    ]);
    // Truncate so the file entry claims more data than the buffer holds
    const truncated = fullBuffer.slice(0, fullBuffer.byteLength - 4);
    expect(() => readGep(truncated)).toThrow("Invalid GEP file");
  });
});
