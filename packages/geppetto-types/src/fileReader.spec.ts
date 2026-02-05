import { describe, expect, it } from "vitest";
import { newFile } from "./testHelpers";
import { writeGep } from "./fileWriter";
import { readGep } from "./fileReader";

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
});
