import { useCallback, useState } from "react";

import { PlayerControlsProvider } from "@/application/modules/animation/state/PlayerControlsProvider";
import { AnimationCanvas } from "@/application/modules/animation/ui/AnimationCanvas";
import type {
  AnimationControlFrame,
  AnimationFrame,
} from "@/application/modules/animation/ui/AnimationTimeline";
import { AnimationTimelines } from "@/application/modules/animation/ui/AnimationTimelines";
import { ControlFrameEdit } from "@/application/modules/animation/ui/ControlFrameEdit";
import { AnimationPane } from "@/application/modules/animation/ui/infoPanes/AnimationPane";
import { ControlFramePane } from "@/application/modules/animation/ui/infoPanes/ConrolFramePane";
import { ControlTrackPane } from "@/application/modules/animation/ui/infoPanes/ControlTrackPane";
import { EventPanel } from "@/application/modules/animation/ui/infoPanes/EventPanel";
import { StartupScreen } from "@/application/modules/application-menu/ui/Startup";
import { useFitToScreenAction } from "@/application/shared/actions/useFitToScreen";
import { useInfoPanel } from "@/application/shared/actions/useInfoPanel";
import { useFile } from "@/application/state/FileContext";
import { useGlobalActionMap } from "@/application/state/hooks/useGlobalActionMap";
import { ActionToolButton } from "@/application/ui/ActionToolButton";
import { SectionSelector } from "@/application/ui/SectionSelector";
import { getAnimationControlFrame } from "@/domain/animation/file2/animations";
import { hasControls } from "@/domain/animation/file2/controls";
import type { AppSection } from "@/dtos/application.dto";
import {
  Column,
  Inlay,
  Panel,
  PanelTitle,
  ResizeDirection,
  ResizePanel,
  Row,
  ToolBar,
  ToolSeparator,
  ToolSpacer,
} from "@/ui/components";

type AnimationModuleProps = {
  onSectionChange?: (newSection: AppSection) => void;
  menu?: React.ReactNode;
  texture: HTMLImageElement | null;
};

const isControlTrack = (
  track: AnimationFrame["track"]
): track is AnimationControlFrame["track"] => track.type === "control";

const isControlFrame = (
  frame: AnimationFrame
): frame is AnimationControlFrame => isControlTrack(frame.track);

export const AnimationModule: React.FC<AnimationModuleProps> = ({
  menu,
  texture,
  onSectionChange,
}) => {
  const [file] = useFile();
  const [activeFrame, setActiveFrame] = useState<AnimationFrame | null>(null);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [activeAnimationState, setActiveAnimationId] = useState<string | null>(
    null
  );
  const [animationsPlaying, setAnimationsPlaying] = useState<string[]>([]);
  const activeAnimationId =
    activeAnimationState && file.animations[activeAnimationState]
      ? activeAnimationState
      : null;

  const stopAnimationState = useCallback((animationId: string) => {
    setAnimationsPlaying((prev) =>
      prev.filter((animId) => animId !== animationId)
    );
  }, []);

  const fitToScreenAction = useFitToScreenAction();
  const [showItemDetails, toggleInfoAction] = useInfoPanel();

  const actions = useGlobalActionMap(
    useCallback(
      () => ({
        toggleInfo: toggleInfoAction,
        fitToScreen: fitToScreenAction,
      }),
      [fitToScreenAction, toggleInfoAction]
    )
  );

  const frame =
    activeFrame && isControlFrame(activeFrame)
      ? getAnimationControlFrame(
          file,
          activeFrame.animationId,
          activeFrame.track.controlId,
          activeFrame.actionIndex
        )
      : null;

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
        <ActionToolButton action={actions.fitToScreen} />
        <ToolSpacer />
        <ActionToolButton
          action={actions.toggleInfo}
          active={showItemDetails}
        />
      </ToolBar>
      <PlayerControlsProvider>
        <Row>
          <Panel center workspace>
            {texture && hasControls(file) && (
              <AnimationCanvas
                activeAnimation={activeAnimationId}
                animationsPlaying={animationsPlaying}
                file={file}
                image={texture}
                onStop={stopAnimationState}
              >
                {activeFrame &&
                  isControlFrame(activeFrame) &&
                  frame &&
                  !showItemDetails && (
                    <Inlay>
                      <ControlFrameEdit
                        actionIndex={activeFrame.actionIndex}
                        animationId={activeFrame.animationId}
                        control={file.controls[activeFrame.track.controlId]}
                        key={`${activeFrame.animationId}-${activeFrame.track.controlId}-${activeFrame.actionIndex}`}
                        quickEdit
                        shadow
                        track={activeFrame.track}
                      />
                    </Inlay>
                  )}
              </AnimationCanvas>
            )}
            {(!texture || !hasControls(file)) && (
              <StartupScreen file={file} texture={texture} />
            )}
          </Panel>
          {showItemDetails && (
            <ResizePanel
              defaultSize={250}
              direction={ResizeDirection.West}
              minSize={150}
            >
              <Panel padding="sm" scrollable>
                {activeFrame && isControlFrame(activeFrame) && frame && (
                  <ControlFramePane activeFrame={activeFrame} />
                )}
                {activeEvent && activeAnimationId && (
                  <EventPanel
                    activeAnimationId={activeAnimationId}
                    eventId={activeEvent}
                  />
                )}

                {activeFrame &&
                  activeFrame.track &&
                  isControlFrame(activeFrame) && (
                    <ControlTrackPane activeFrame={activeFrame} />
                  )}

                {activeAnimationId && (
                  <AnimationPane activeAnimationId={activeAnimationId} />
                )}

                {!activeAnimationId && (
                  <PanelTitle>No animation selected</PanelTitle>
                )}
              </Panel>
            </ResizePanel>
          )}
        </Row>
        {texture && hasControls(file) && (
          <ResizePanel
            defaultSize={250}
            direction={ResizeDirection.North}
            minSize={50}
          >
            <AnimationTimelines
              animationsPlaying={animationsPlaying}
              onEventSelect={(eventId) => {
                setActiveEvent(eventId);
                setActiveFrame(null);
              }}
              onFrameSelect={(frame) => {
                setActiveFrame(frame);
                setActiveEvent(null);
              }}
              onSelectAnimation={setActiveAnimationId}
              onStartAnimations={(ids) =>
                setAnimationsPlaying((prev) => [...prev, ...ids])
              }
              onStopAnimations={(ids) =>
                setAnimationsPlaying((prev) =>
                  prev.filter((animId) => !ids.includes(animId))
                )
              }
              selectedAnimation={activeAnimationId}
              selectedEvent={activeEvent}
              selectedFrame={activeFrame}
            />
          </ResizePanel>
        )}
      </PlayerControlsProvider>
    </Column>
  );
};
