import { isNewFile, newFile } from "./new";
import { fileBuilder } from "./testFileBuilder";

describe("newFile", () => {
  it("creates a new file to use", () => {
    const result = newFile();
    expect(result.version).toEqual("2.0");
  });
});

describe("isNewFile", () => {
  it("returns true for a new file", () => {
    const file = newFile();
    const result = isNewFile(file);
    expect(result).toEqual(true);
  });

  it("returns false if file is mutated", () => {
    const file = fileBuilder().addShape("item").build();
    const result = isNewFile(file);
    expect(result).toEqual(false);
  });
});
