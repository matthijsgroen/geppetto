import { useCallback, useEffect, useState } from "react";

import { PlayerControlsProvider } from "@/application/modules/animation/state/PlayerControlsProvider";
import { AnimationCanvas } from "@/application/modules/animation/ui/AnimationCanvas";
import type {
  AnimationControlFrame,
  AnimationFrame,
} from "@/application/modules/animation/ui/AnimationTimeline";
import { AnimationTimelines } from "@/application/modules/animation/ui/AnimationTimelines";
import { ControlFrameEdit } from "@/application/modules/animation/ui/ControlFrameEdit";
import { StartupScreen } from "@/application/modules/application-menu/ui/Startup";
import { useFile } from "@/application/state/FileContext";
import { useActionMap } from "@/application/state/hooks/useActionMap";
import { useUpdateScreenTranslation } from "@/application/state/ScreenTranslationContext";
import { ActionToolButton } from "@/application/ui/ActionToolButton";
import { SectionSelector } from "@/application/ui/SectionSelector";
import {
  deleteControlFrame,
  getAnimationControlFrame,
} from "@/domain/animation/file2/animations";
import { hasControls } from "@/domain/animation/file2/controls";
import type { AppSection } from "@/dtos/application.dto";
import type { Shortcut } from "@/ui/components";
import {
  Column,
  Inlay,
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

const TOGGLE_INFO_SHORTCUT: Shortcut = {
  ctrlOrCmd: true,
  interaction: "KeyI",
};

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
              <Column>
                <Panel padding="sm">
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
                      <ToolBar transparent>
                        <ToolSpacer />
                        <ToolButton
                          dangerous
                          label="Delete"
                          onClick={() => {
                            if (activeFrame && isControlFrame(activeFrame)) {
                              setFile(
                                deleteControlFrame(
                                  activeFrame.animationId,
                                  activeFrame.track.controlId,
                                  activeFrame.actionIndex
                                )
                              );
                              setActiveFrame(null);
                            }
                          }}
                          standAlone
                        />
                        <ToolSpacer />
                      </ToolBar>
                    </>
                  )}
                </Panel>
              </Column>
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
