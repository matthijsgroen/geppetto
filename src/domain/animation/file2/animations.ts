import type {
  FrameAction,
  FrameControlAction,
  FrameEvent,
} from "@/dtos/animation-file2.dto";

export const isFrameControlAction = (
  action: FrameAction
): action is FrameControlAction => "controlId" in action;

export const isFrameEvent = (action: FrameAction): action is FrameEvent =>
  "event" in action;
