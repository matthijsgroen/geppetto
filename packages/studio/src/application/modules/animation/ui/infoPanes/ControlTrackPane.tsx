import type { FC } from "react";

import type { AnimationControlFrame } from "@/application/modules/animation/ui/AnimationTimeline";
import { formatTime } from "@/application/shared/timeFormatter";
import { useFile } from "@/application/state/FileContext";
import { ErrorBoundary } from "@/application/ui/ErrorBoundary";
import { Label } from "@/ui/components/atoms/Label/Label";
import { PanelTitle } from "@/ui/components/atoms/PanelTitle/PanelTitle";
import { Control } from "@/ui/components/molecules/Control/Control";
import { ControlPanel } from "@/ui/components/molecules/ControlPanel/ControlPanel";

export const ControlTrackPane: FC<{
  activeFrame: AnimationControlFrame;
}> = ({ activeFrame }) => {
  const [file] = useFile();
  const currentSelectedAnimation = file.animations[activeFrame.animationId];

  return (
    <ErrorBoundary fallback={<div>Error loading track details</div>}>
      <PanelTitle>Track Details</PanelTitle>
      <ControlPanel>
        <Control label="Name">
          <Label>{file.controls[activeFrame.track.controlId].name}</Label>
        </Control>
        <Control label="Duration">
          <Label>
            {formatTime(
              activeFrame.track.length /
                (currentSelectedAnimation?.speedModifier ?? 1)
            )}
          </Label>
        </Control>
      </ControlPanel>
    </ErrorBoundary>
  );
};
