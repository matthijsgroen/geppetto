import { convertV1toV2 } from "./convertV1toV2";
import { convertV2toV1 } from "./convertV2toV1";
import { v1Format } from "./mockdata/file1.1";
import { v2Format } from "./mockdata/file2.0";

describe("from version 1 to 2", () => {
  it("converts a 1.x file format to a 2.x file format", () => {
    const v2 = convertV1toV2(v1Format);
    expect(v2).toEqual(v2Format);
  });
});

describe("from version 2 to 1", () => {
  it("converts a 2.x file format to a 1.x file format", () => {
    const v1 = convertV2toV1(v2Format);
    expect(v1).toEqual(v1Format);
  });
});
