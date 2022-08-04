import produce from "immer";
import { ControlStyle } from "../../old/components/Toolbar";
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
  });

export const addControlStep = (controlId: string) =>
  produce<GeppettoImage>((draft) => {
    const steps = draft.controls[controlId].steps;
    const lastStep = steps[steps.length - 1];
    const newStep = { ...lastStep };
    steps.push(newStep);
  });
