import type { FC } from "react";

import { useFile } from "@/application/state/FileContext";
import { ErrorBoundary } from "@/application/ui/ErrorBoundary";
import { PanelTitle } from "@/ui/components/atoms/PanelTitle/PanelTitle";

import type { AnimationControlFrame } from "../AnimationTimeline";
import { ControlFrameEdit } from "../ControlFrameEdit";

export const ControlFramePane: FC<{
  activeFrame: AnimationControlFrame;
}> = ({ activeFrame }) => {
  const [file] = useFile();

  return (
    <ErrorBoundary fallback={<div>Error loading control frame edit</div>}>
      <PanelTitle>
        {file.controls[activeFrame.track.controlId].name} Frame
      </PanelTitle>
      <ControlFrameEdit
        actionIndex={activeFrame.actionIndex}
        animationId={activeFrame.animationId}
        control={file.controls[activeFrame.track.controlId]}
        key={`${activeFrame.animationId}-${activeFrame.track.controlId}-${activeFrame.actionIndex}`}
        track={activeFrame.track}
      />
    </ErrorBoundary>
  );
};
