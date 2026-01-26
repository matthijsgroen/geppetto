import { useCallback, useEffect, useState } from "react";

import { PlayerControlsProvider } from "@/application/modules/animation/state/PlayerControlsProvider";
import { AnimationCanvas } from "@/application/modules/animation/ui/AnimationCanvas";
import { AnimationSpeedOptions } from "@/application/modules/animation/ui/AnimationSpeedOptions";
import type {
  AnimationControlFrame,
  AnimationFrame,
} from "@/application/modules/animation/ui/AnimationTimeline";
import { AnimationTimelines } from "@/application/modules/animation/ui/AnimationTimelines";
import { ControlFrameEdit } from "@/application/modules/animation/ui/ControlFrameEdit";
import { StartupScreen } from "@/application/modules/application-menu/ui/Startup";
import { ToggleControl } from "@/application/modules/composition/ui/controls";
import { TOGGLE_INFO_SHORTCUT } from "@/application/shared/keymap";
import { formatSpeed } from "@/application/shared/speedFormatter";
import { formatTime } from "@/application/shared/timeFormatter";
import { useFile } from "@/application/state/FileContext";
import { useActionMap } from "@/application/state/hooks/useActionMap";
import { useUpdateScreenTranslation } from "@/application/state/ScreenTranslationContext";
import { ActionToolButton } from "@/application/ui/ActionToolButton";
import { SectionSelector } from "@/application/ui/SectionSelector";
import {
  getAnimationControlFrame,
  getAnimationDuration,
  updateLoopingAnimation,
} from "@/domain/animation/file2/animations";
import { hasControls } from "@/domain/animation/file2/controls";
import type { AppSection } from "@/dtos/application.dto";
import type { Shortcut } from "@/ui/components";
import {
  Column,
  Control,
  ControlPanel,
  Inlay,
  Label,
  Menu,
  Panel,
  PanelTitle,
  ResizeDirection,
  ResizePanel,
  Row,
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
  const [file, setFile] = useFile();
  const [activeFrame, setActiveFrame] = useState<AnimationFrame | null>(null);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const resetZoom = useUpdateScreenTranslation();
  const [animationsPlaying, setAnimationsPlaying] = useState<string[]>([]);

  const stopAnimationState = useCallback((animationId: string) => {
    setAnimationsPlaying((prev) =>
      prev.filter((animId) => animId !== animationId)
    );
  }, []);

  const { actions, triggerKeyboardAction } = useActionMap(
    useCallback(
      () => ({
        toggleInfo: {
          icon: "ℹ",
          colorizedIcon: true,
          tooltip: "Toggle info display",
          shortcut: TOGGLE_INFO_SHORTCUT,
          handler: () => {
            setShowItemDetails((prev) => !prev);
          },
        },
        fitToScreen: {
          icon: "⛶",
          colorizedIcon: true,
          label: "Fit",
          tooltip: "Fit to screen",
          shortcut: { alt: true, interaction: "KeyF" } as Shortcut,
          handler: () => {
            resetZoom(() => ({
              zoom: 1.0,
              scale: 1.0,
              panX: 0,
              panY: 0,
            }));
          },
        },
      }),
      [resetZoom]
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

  // TODO: Maybe make this part of the useActionMap hook?
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (triggerKeyboardAction(event)) {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [triggerKeyboardAction, actions]);

  const currentSelectedAnimation = activeAnimation
    ? file.animations[activeAnimation]
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
                activeAnimation={activeAnimation}
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
                  <>
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
                  </>
                )}

                {activeFrame &&
                  activeFrame.track &&
                  isControlTrack(activeFrame.track) && (
                    <>
                      <PanelTitle>Track Details</PanelTitle>
                      <ControlPanel>
                        <Control label="Name">
                          <Label>
                            {file.controls[activeFrame.track.controlId].name}
                          </Label>
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
                    </>
                  )}

                {currentSelectedAnimation && activeAnimation && (
                  <>
                    <PanelTitle>Animation Details</PanelTitle>
                    <ControlPanel>
                      <Control label="Name">
                        <Label>{currentSelectedAnimation.name}</Label>
                      </Control>
                      <Control label="Duration">
                        <Label>
                          {formatTime(
                            getAnimationDuration(currentSelectedAnimation)
                          )}
                        </Label>
                      </Control>
                      <ToggleControl
                        label="Looping"
                        onChange={(value) =>
                          setFile(
                            updateLoopingAnimation(activeAnimation, value)
                          )
                        }
                        value={currentSelectedAnimation.looping}
                      />
                      <Control label="Speed Modifier">
                        <Menu
                          align="center"
                          arrow
                          direction="bottom"
                          menuButton={({ open }) => (
                            <ToolButton
                              active={open}
                              label={formatSpeed(
                                currentSelectedAnimation.speedModifier ?? 1
                              )}
                            />
                          )}
                          portal
                          transition
                        >
                          <AnimationSpeedOptions
                            animationId={activeAnimation}
                          />
                        </Menu>
                      </Control>
                    </ControlPanel>
                  </>
                )}

                {!activeAnimation && (
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
              onFrameSelect={(frame) => {
                setActiveFrame(frame);
              }}
              onSelectAnimation={setActiveAnimation}
              onStartAnimation={(id) =>
                setAnimationsPlaying((prev) => [...prev, id])
              }
              onStopAnimation={(id) =>
                setAnimationsPlaying((prev) =>
                  prev.filter((animId) => animId !== id)
                )
              }
              selectedAnimation={activeAnimation}
              selectedFrame={activeFrame}
            />
          </ResizePanel>
        )}
      </PlayerControlsProvider>
    </Column>
  );
};
