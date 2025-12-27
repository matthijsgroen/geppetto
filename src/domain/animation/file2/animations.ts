import type {
  FrameAction,
  FrameControlAction,
} from "@/dtos/animation-file2.dto";

export const isFrameControlAction = (
  action: FrameAction
): action is FrameControlAction => "controlId" in action;
