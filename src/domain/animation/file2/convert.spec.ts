import { type ImageDefinition } from "@/dtos/animation-file1.dto";
import { v1Format } from "@/shared/test/mockdata/file1.1";
import { v2Format } from "@/shared/test/mockdata/file2.0";

import { convertFromV1 } from "./convert";

describe("from version 1 to 2", () => {
  it("converts a 1.x file format to a 2.x file format", () => {
    const v2 = convertFromV1(v1Format);
    expect(v2).toEqual(v2Format);
  });

  describe("animations", () => {
    it("turns control actions in control transitions", () => {
      const v1WithAnimation: ImageDefinition = {
        ...v1Format,
        animations: [
          {
            name: "Test Animation",
            looping: true,
            keyframes: [
              {
                time: 0,
                controlValues: {
                  HeadRotate: 0,
                },
              },
              {
                time: 1000,
                controlValues: {
                  HeadRotate: 1,
                },
              },
            ],
          },
        ],
      };
      const v2 = convertFromV1(v1WithAnimation);
      const animationIds = Object.keys(v2.animations);
      expect(animationIds).toHaveLength(1);

      const animation = v2.animations[animationIds[0]];
      expect(animation.name).toBe("Test Animation");
      expect(animation.actions).toEqual([
        {
          frameId: "1",
          start: 0,
          duration: 1000,
          easingFunction: "linear",
          controlId: "0",
          controlStartValue: 0,
          controlEndValue: 1,
        },
      ]);
    });

    it("turns control action resets in control transitions", () => {
      const v1WithAnimation: ImageDefinition = {
        ...v1Format,
        animations: [
          {
            name: "Test Animation",
            looping: true,
            keyframes: [
              {
                time: 0,
                controlValues: {
                  HeadRotate: 0,
                },
              },
              {
                time: 1000,
                controlValues: {
                  HeadRotate: 1,
                },
              },
              {
                time: 1001,
                controlValues: {
                  HeadRotate: 0,
                },
              },
              {
                time: 2000,
                controlValues: {
                  HeadRotate: 1,
                },
              },
            ],
          },
        ],
      };
      const v2 = convertFromV1(v1WithAnimation);
      const animationIds = Object.keys(v2.animations);
      expect(animationIds).toHaveLength(1);

      const animation = v2.animations[animationIds[0]];
      expect(animation.name).toBe("Test Animation");
      expect(animation.actions).toEqual([
        {
          frameId: "1",
          start: 0,
          duration: 1000,
          easingFunction: "linear",
          controlId: "0",
          controlStartValue: 0,
          controlEndValue: 1,
        },
        {
          frameId: "2",
          start: 1000,
          duration: 1000,
          easingFunction: "linear",
          controlId: "0",
          controlStartValue: 0,
          controlEndValue: 1,
        },
      ]);
    });
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
