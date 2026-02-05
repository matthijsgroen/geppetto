import { describe, expect, it } from "vitest";
import { writeGep } from "./fileWriter";
import { newFile } from "./testHelpers";

describe("File Writer", () => {
  it("writeGep produces correct ArrayBuffer", async () => {
    const image = newFile();
    const arrayBuffer = await writeGep(image, []);

    const decoder = new TextDecoder();

    // Check magic number
    const magic = decoder.decode(new Uint8Array(arrayBuffer, 0, 4));
    expect(magic).toBe("GEP1");
  });

  it("writeGep correctly includes files", async () => {
    const image = newFile();
    const fileData = new Uint8Array([1, 2, 3, 4]);
    const arrayBuffer = await writeGep(image, [
      { name: "test.bin", mime: "application/octet-stream", data: fileData },
    ]);

    const decoder = new TextDecoder();

    // Check magic number
    const magic = decoder.decode(new Uint8Array(arrayBuffer, 0, 4));
    expect(magic).toBe("GEP1");

    // Check file data is included at the end
    const fileDataFromBuffer = new Uint8Array(
      arrayBuffer,
      arrayBuffer.byteLength - 4
    );
    expect(fileDataFromBuffer).toEqual(fileData);
  });
});
