import { addControl, AddControlDetails } from "./controls";
import { newFile } from "./new";

describe("addControl", () => {
  it("adds a control to the provided file", () => {
    const file = newFile();

    const result: AddControlDetails | {} = {};
    const image = addControl("New control", undefined, result)(file);
    expect(image.controlHierarchy["0"]).toEqual({
      type: "control",
      parentId: "root",
    });

    expect(result).toHaveProperty("control", {
      name: "New control",
      steps: [{}, {}],
      type: "slider",
    });
    expect(result).toHaveProperty("id", "0");
  });
});
