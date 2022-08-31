import { convertFromV1 } from "./convert";
import { v1Format } from "../file1/mockdata/file1.1";
import { v2Format } from "./mockdata/file2.0";
import { ImageDefinition } from "../file1/types";

describe("from version 1 to 2", () => {
  it("converts a 1.x file format to a 2.x file format", () => {
    const v2 = convertFromV1(v1Format);
    expect(v2).toEqual(v2Format);
  });

  describe("corrupt file cases", () => {
    it("uses id 'error' for non-existing mutations", () => {
      const corruptV1Format: ImageDefinition = {
        ...v1Format,
        defaultFrame: {
          ...v1Format.defaultFrame,
          nonExistentMutation: [1, 2.1],
        },
      };

      const v2 = convertFromV1(corruptV1Format);
      expect(v2.defaultFrame).toHaveProperty("error", [1, 2.1]);
    });

    it("uses id 'error' for non-existing controls", () => {
      const corruptV1Format: ImageDefinition = {
        ...v1Format,
        controlValues: {
          ...v1Format.defaultFrame,
          nonExistentMutation: 0.2,
        },
      };

      const v2 = convertFromV1(corruptV1Format);
      expect(v2.controlValues).toHaveProperty("error", 0.2);
    });
  });
});
