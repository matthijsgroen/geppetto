import { useState } from "react";

import { AnimationCanvas } from "@/application/modules/animation/ui/AnimationCanvas";
import type {
  AnimationControlFrame,
  AnimationFrame,
} from "@/application/modules/animation/ui/AnimationTimeline";
import { AnimationTimelines } from "@/application/modules/animation/ui/AnimationTimelines";
import { ControlFrameEdit } from "@/application/modules/animation/ui/ControlFrameEdit";
import { StartupScreen } from "@/application/modules/application-menu/ui/Startup";
import { useFile } from "@/application/state/FileContext";
import { SectionSelector } from "@/application/ui/SectionSelector";
import { hasControls } from "@/domain/animation/file2/controls";
import type { AppSection } from "@/dtos/application.dto";
import {
  Column,
  Icon,
  Panel,
  PanelTitle,
  ResizeDirection,
  ResizePanel,
  ToolBar,
  ToolButton,
  ToolSeparator,
  ToolSpacer,
} from "@/ui/components";

type AnimationModuleProps = {
  onSectionChange?: (newSection: AppSection) => void;
  menu?: React.ReactNode;
  texture: HTMLImageElement | null;
};

const isControlFrame = (
  frame: AnimationFrame
): frame is AnimationControlFrame => frame.track.type === "control";

export const AnimationModule: React.FC<AnimationModuleProps> = ({
  menu,
  texture,
  onSectionChange,
}) => {
  const [file] = useFile();
  const [activeFrame, setActiveFrame] = useState<AnimationFrame | null>(null);

  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolSeparator />
        <SectionSelector
          activeSection="animation"
          onSectionChange={onSectionChange}
        />
      </ToolBar>
      <Panel center workspace>
        {texture && hasControls(file) && (
          <AnimationCanvas file={file} image={texture}>
            {activeFrame && isControlFrame(activeFrame) && (
              <ControlFrameEdit
                actionIndex={activeFrame.actionIndex}
                animationId={activeFrame.animationId}
                frame={activeFrame.frame}
                track={activeFrame.track}
              />
            )}
          </AnimationCanvas>
        )}
        {(!texture || !hasControls(file)) && (
          <StartupScreen file={file} texture={texture} />
        )}
      </Panel>
      {texture && hasControls(file) && (
        <ResizePanel
          defaultSize={250}
          direction={ResizeDirection.North}
          minSize={50}
        >
          <Panel padding="sm">
            <ToolBar>
              <PanelTitle>Animations</PanelTitle>
              <ToolButton
                disabled
                icon={<Icon>⏮️</Icon>}
                tooltip="Go to start"
              />
              <ToolButton
                disabled
                icon={<Icon>▶️</Icon>}
                tooltip="Play/Pause"
              />
              <ToolButton disabled icon={<Icon>⏭️</Icon>} tooltip="Go to end" />
              <ToolSeparator />
              <ToolButton
                disabled
                icon={<Icon>➕</Icon>}
                label="Animation"
                tooltip="Add Animation track"
              />
              <ToolButton
                disabled
                icon={<Icon>➕</Icon>}
                label="Event"
                tooltip="Add Event"
              />
              <ToolButton
                disabled
                icon={<Icon>➕</Icon>}
                label="Control"
                tooltip="Add Control layer"
              />
              <ToolSpacer />
              <ToolButton disabled icon={<Icon>?</Icon>} tooltip="Help" />
            </ToolBar>
            <AnimationTimelines
              onFrameSelect={(frame) => {
                setActiveFrame(frame);
              }}
              selectedFrame={activeFrame}
              zoom={2}
            />
          </Panel>
        </ResizePanel>
      )}
    </Column>
  );
};
