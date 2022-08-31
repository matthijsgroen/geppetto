import produce from "immer";
import { addInHierarchy, PlacementInfo } from "./hierarchy";
import { getUniqueName } from "./shapes";
import { ControlDefinition, GeppettoImage } from "./types";

export type AddControlDetails = { control: ControlDefinition; id: string };
export const addControl = (
  controlName: string,
  position?: PlacementInfo,
  dataResult?: AddControlDetails | {}
) =>
  produce<GeppettoImage>((draft) => {
    const newName = getUniqueName(controlName, draft.controls);
    const control: ControlDefinition = {
      name: newName,
      steps: [{}, {}],
      type: "slider",
    };
    const [controlHierarchy, newId] = addInHierarchy<
      "controlFolder" | "control"
    >(draft.controlHierarchy, { type: "control" }, position);

    if (dataResult) {
      Object.assign(dataResult, { id: newId, control });
    }

    draft.controlHierarchy = controlHierarchy;
    draft.controls[newId] = control;
    draft.controlValues[newId] = 0;
  });

export const insertControlStep = (controlId: string, stepIndex = -1) =>
  produce<GeppettoImage>((draft) => {
    const steps = draft.controls[controlId].steps;
    const index = stepIndex === -1 ? steps.length - 1 : stepIndex;
    const lastStep = steps[index];
    const newStep = { ...lastStep };
    steps.splice(stepIndex === -1 ? index + 1 : index, 0, newStep);
  });

export const removeControlStep = (controlId: string, stepIndex: number) =>
  produce<GeppettoImage>((draft) => {
    const steps = draft.controls[controlId].steps;
    if (steps.length === 2) return;
    steps.splice(stepIndex, 1);
  });

export const addMutationToControl = (controlId: string, mutationId: string) =>
  produce<GeppettoImage>((draft) => {
    const startValue = draft.defaultFrame[mutationId];
    for (const step of draft.controls[controlId].steps) {
      step[mutationId] = startValue;
    }
  });

export const removeMutationFromControl = (
  controlId: string,
  mutationId: string
) =>
  produce<GeppettoImage>((draft) => {
    for (const step of draft.controls[controlId].steps) {
      delete step[mutationId];
    }
  });

export const isMutationUnderControl = (
  file: GeppettoImage,
  controlId: string,
  mutationId: string
) => file.controls[controlId].steps.some((step) => step[mutationId]);
