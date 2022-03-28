import { convertv1tov2, convertv2tov1 } from "./convert";
import { v1Format } from "./mockdata/file1.1";
import { v2Format } from "./mockdata/file2.0";

describe("from1to2", () => {
  it("converts a 1.x file format to a 2.x file format", () => {
    const v2 = convertv1tov2(v1Format);
    expect(v2).toEqual(v2Format);
  });

  it("converts a 2.x file format to a 1.x file format", () => {
    const v1 = convertv2tov1(v2Format);
    expect(v1).toEqual(v1Format);
  });
});
