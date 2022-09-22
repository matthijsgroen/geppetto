import { FrameAction, FrameControlAction } from "./types";

export const isFrameControlAction = (
  action: FrameAction
): action is FrameControlAction => "controlId" in action;
