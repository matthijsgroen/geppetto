import { convertFromV2 } from "./convert";
import { v1Format } from "./mockdata/file1.1";
import { v2Format } from "../file2/mockdata/file2.0";

describe("from version 2 to 1", () => {
  it("converts a 2.x file format to a 1.x file format", () => {
    const v1 = convertFromV2(v2Format);
    expect(v1).toEqual(v1Format);
  });
});
