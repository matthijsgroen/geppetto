import type { FC } from "react";

import { AnimationSpeedOptions } from "@/application/modules/animation/ui/AnimationSpeedOptions";
import { ToggleControl } from "@/application/modules/composition/ui/controls/ToggleControl";
import { formatSpeed } from "@/application/shared/speedFormatter";
import { formatTime } from "@/application/shared/timeFormatter";
import { useFile } from "@/application/state/FileContext";
import { ErrorBoundary } from "@/application/ui/ErrorBoundary";
import {
  getAnimationDuration,
  updateAutoplayAnimation,
  updateLoopingAnimation,
} from "@/domain/animation/file2/animations";
import { Label } from "@/ui/components/atoms/Label/Label";
import { PanelTitle } from "@/ui/components/atoms/PanelTitle/PanelTitle";
import { ToolButton } from "@/ui/components/atoms/ToolButton/ToolButton";
import { Control } from "@/ui/components/molecules/Control/Control";
import { ControlPanel } from "@/ui/components/molecules/ControlPanel/ControlPanel";
import { Menu } from "@/ui/components/organisms/Menu/Menu";

export const AnimationPane: FC<{ activeAnimationId: string }> = ({
  activeAnimationId,
}) => {
  const [file, setFile] = useFile();

  const currentSelectedAnimation = activeAnimationId
    ? file.animations[activeAnimationId]
    : null;

  if (!currentSelectedAnimation) {
    return null;
  }

  return (
    <ErrorBoundary fallback={<div>Error loading animation details</div>}>
      <PanelTitle>Animation Details</PanelTitle>
      <ControlPanel>
        <Control label="Name">
          <Label>{currentSelectedAnimation.name}</Label>
        </Control>
        <Control label="Duration">
          <Label>
            {formatTime(getAnimationDuration(currentSelectedAnimation))}
          </Label>
        </Control>
        <ToggleControl
          label="Looping"
          onChange={(value) =>
            setFile(updateLoopingAnimation(activeAnimationId, value))
          }
          value={currentSelectedAnimation.looping}
        />
        <ToggleControl
          label="Autoplay"
          onChange={(value) =>
            setFile(updateAutoplayAnimation(activeAnimationId, value))
          }
          value={currentSelectedAnimation.autoplay ?? false}
        />
        <Control label="Speed Modifier">
          <Menu
            align="center"
            arrow
            direction="bottom"
            menuButton={({ open }) => (
              <ToolButton
                active={open}
                label={formatSpeed(currentSelectedAnimation.speedModifier ?? 1)}
              />
            )}
            portal
            transition
          >
            <AnimationSpeedOptions animationId={activeAnimationId} />
          </Menu>
        </Control>
      </ControlPanel>
    </ErrorBoundary>
  );
};
