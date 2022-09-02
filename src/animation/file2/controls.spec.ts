import produce from "immer";
import { isExportDeclaration } from "typescript";
import {
  addControl,
  AddControlDetails,
  insertControlStep,
  addMutationToControl,
  isMutationUnderControl,
  removeControlStep,
  removeMutationFromControl,
  removeControls,
} from "./controls";
import { newFile } from "./new";
import {
  fileBuilder,
  getControlIdByName,
  getMutationIdByName,
} from "./testFileBuilder";

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

describe("removeControls", () => {
  it("removes the selected controls", () => {
    const file = fileBuilder().addControl("Control").build();
    const controlId = getControlIdByName(file, "Control");

    const updatedFile = removeControls([controlId])(file);
    expect(updatedFile.controlValues).not.toHaveProperty(controlId);
    expect(updatedFile.controlHierarchy).not.toHaveProperty(controlId);
    expect(updatedFile.controls).not.toHaveProperty(controlId);
  });
});

describe("insertControlStep", () => {
  it("adds a step to an exiting control", () => {
    const file = fileBuilder().addControl("Control").build();
    const controlId = getControlIdByName(file, "Control");

    const updatedFile = insertControlStep(controlId)(file);

    expect(file.controls[controlId].steps).toHaveLength(2);
    expect(updatedFile.controls[controlId].steps).toHaveLength(3);
  });

  it("duplicates values of the previous last step", () => {
    const file = fileBuilder().addControl("Control").build();
    const controlId = getControlIdByName(file, "Control");
    const fileWithValue = produce(file, (draft) => {
      draft.controls[controlId].steps[1].MutationId = [1, 3];
    });

    const updatedFile = insertControlStep(controlId)(fileWithValue);

    expect(updatedFile.controls[controlId].steps[1]).toEqual({
      MutationId: [1, 3],
    });
    expect(updatedFile.controls[controlId].steps[2]).toEqual({
      MutationId: [1, 3],
    });
    expect(updatedFile.controls[controlId].steps[1]).not.toBe(
      updatedFile.controls[controlId].steps[2]
    );
  });

  it("can insert steps between others", () => {
    const file = fileBuilder().addControl("Control").build();
    const controlId = getControlIdByName(file, "Control");

    const updatedFile = insertControlStep(controlId, 0)(file);

    expect(file.controls[controlId].steps).toHaveLength(2);
    expect(updatedFile.controls[controlId].steps).toHaveLength(3);
  });
});

describe("removeControlStep", () => {
  const file = fileBuilder()
    .addControl("control1")
    .addShape("shape1")
    .addMutation(
      "mutation",
      "translate",
      { origin: [10, 20], radius: -1 },
      "shape1"
    )
    .setMutationValue("mutation", [50, -10])
    .build();

  const controlId = getControlIdByName(file, "control1");
  const mutationId = getMutationIdByName(file, "mutation");

  it("needs a minimum of 2 steps", () => {
    const controlMutationFile = addMutationToControl(
      controlId,
      mutationId
    )(file);
    expect(controlMutationFile.controls[controlId].steps).toHaveLength(2);

    const resultFile = removeControlStep(controlId, 0)(controlMutationFile);
    expect(resultFile.controls[controlId].steps).toHaveLength(2);
  });

  it("removes step from control", () => {
    const controlMutationFile = addMutationToControl(
      controlId,
      mutationId
    )(insertControlStep(controlId)(file));
    expect(controlMutationFile.controls[controlId].steps).toHaveLength(3);

    const resultFile = removeControlStep(controlId, 0)(controlMutationFile);
    expect(resultFile.controls[controlId].steps).toHaveLength(2);
  });
});

describe("addMutationToControl", () => {
  it("copies mutation value to control", () => {
    const file = fileBuilder()
      .addControl("control1")
      .addShape("shape1")
      .addMutation(
        "mutation",
        "translate",
        { origin: [10, 20], radius: -1 },
        "shape1"
      )
      .setMutationValue("mutation", [50, -10])
      .build();

    const controlId = getControlIdByName(file, "control1");
    const mutationId = getMutationIdByName(file, "mutation");

    const updatedFile = addMutationToControl(controlId, mutationId)(file);

    expect(updatedFile.controls[controlId].steps).toEqual([
      {
        [mutationId]: [50, -10],
      },
      {
        [mutationId]: [50, -10],
      },
    ]);

    expect(isMutationUnderControl(updatedFile, controlId, mutationId)).toEqual(
      true
    );
  });
});

describe("removeMutationFromControl", () => {
  it("removes mutation from all steps", () => {
    const file = fileBuilder()
      .addControl("control1")
      .addShape("shape1")
      .addMutation(
        "mutation",
        "translate",
        { origin: [10, 20], radius: -1 },
        "shape1"
      )
      .setMutationValue("mutation", [50, -10])
      .build();

    const controlId = getControlIdByName(file, "control1");
    const mutationId = getMutationIdByName(file, "mutation");

    const updatedFile = addMutationToControl(controlId, mutationId)(file);

    const resultFile = removeMutationFromControl(
      controlId,
      mutationId
    )(updatedFile);

    expect(resultFile.controls[controlId].steps).toEqual([{}, {}]);
    expect(isMutationUnderControl(resultFile, controlId, mutationId)).toEqual(
      false
    );
  });
});
