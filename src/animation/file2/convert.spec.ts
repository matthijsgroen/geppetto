import { convertFromV1 } from "./convert";
import { v1Format } from "../file1/mockdata/file1.1";
import { v2Format } from "./mockdata/file2.0";

describe("from version 1 to 2", () => {
  it("converts a 1.x file format to a 2.x file format", () => {
    const v2 = convertFromV1(v1Format);
    expect(v2).toEqual(v2Format);
  });
});
