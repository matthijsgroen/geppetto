import { addControl, AddControlDetails, addControlStep } from "./controls";
import { newFile } from "./new";
import { fileBuilder, getControlIdByName } from "./testFileBuilder";

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

describe("addControlStep", () => {
  it("adds a step to an exiting step", () => {
    const file = fileBuilder().addControl("Control").build();
    const controlId = getControlIdByName(file, "Control");

    const updatedFile = addControlStep(controlId)(file);

    expect(file.controls[controlId].steps).toHaveLength(2);
    expect(updatedFile.controls[controlId].steps).toHaveLength(3);
  });
});
