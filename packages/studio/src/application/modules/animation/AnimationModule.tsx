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
import { useUpdateScreenTranslation } from "@/application/state/ScreenTranslationContext";
import { SectionSelector } from "@/application/ui/SectionSelector";
import { hasControls } from "@/domain/animation/file2/controls";
import type { AppSection } from "@/dtos/application.dto";
import {
  Column,
  Icon,
  Panel,
  ResizeDirection,
  ResizePanel,
  ToolBar,
  ToolButton,
  ToolSeparator,
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
  const resetZoom = useUpdateScreenTranslation();
  const [animationsPlaying, setAnimationsPlaying] = useState<string[]>([]);

  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolSeparator />
        <SectionSelector
          activeSection="animation"
          onSectionChange={onSectionChange}
        />
        <ToolSeparator />
        <ToolButton
          icon={<Icon colorize>⛶</Icon>}
          label="Fit"
          onClick={() => {
            resetZoom(() => ({
              zoom: 1.0,
              scale: 1.0,
              panX: 0,
              panY: 0,
            }));
          }}
          tooltip="Fit to screen"
        />
      </ToolBar>
      <Panel center workspace>
        {texture && hasControls(file) && (
          <AnimationCanvas
            animationsPlaying={animationsPlaying}
            file={file}
            image={texture}
          >
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
          <AnimationTimelines
            animationsPlaying={animationsPlaying}
            onFrameSelect={(frame) => {
              setActiveFrame(frame);
            }}
            onStartAnimation={(id) =>
              setAnimationsPlaying((prev) => [...prev, id])
            }
            onStopAnimation={(id) =>
              setAnimationsPlaying((prev) =>
                prev.filter((animId) => animId !== id)
              )
            }
            selectedFrame={activeFrame}
          />
        </ResizePanel>
      )}
    </Column>
  );
};
