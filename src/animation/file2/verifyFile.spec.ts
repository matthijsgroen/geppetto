import { verifyFile } from "./verifyFile";
import { v1Format } from "../file1/mockdata/file1.1";
import { v2Format } from "./mockdata/file2.0";

describe("verifyFile", () => {
  it("returns true for a valid version 2 file", () => {
    expect(verifyFile(v2Format)).toEqual(true);
  });

  it("returns false for a version 1 file", () => {
    expect(verifyFile(v1Format)).toEqual(false);
  });

  it("returns true for an invalid version 2 file", () => {
    const brokenFle = { ...v2Format, otherKey: true };
    expect(verifyFile(brokenFle)).toEqual(false);
  });
});
