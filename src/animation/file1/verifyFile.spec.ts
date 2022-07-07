import { verifyFile } from "./verifyFile";
import { v1Format } from "./mockdata/file1.1";
import { v2Format } from "../file2/mockdata/file2.0";

describe("verifyFile", () => {
  it("returns true for a valid version 1 file", () => {
    expect(verifyFile(v1Format)).toEqual(true);
  });

  it("returns false for a version 2 file", () => {
    expect(verifyFile(v2Format)).toEqual(false);
  });

  it("returns true for an invalid version 1 file", () => {
    const brokenFle = { ...v1Format, otherKey: true };
    expect(verifyFile(brokenFle)).toEqual(false);
  });

  it("returns false for a string", () => {
    expect(verifyFile("test")).toEqual(false);
  });

  it("returns false for null", () => {
    expect(verifyFile(null)).toEqual(false);
  });
});
