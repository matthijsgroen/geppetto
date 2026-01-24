import type { GeppettoImage } from "@geppetto/types";
import { type FC, type PropsWithChildren, useEffect, useRef } from "react";

import { useAnimationsPlaying } from "@/application/modules/animation/hooks/useAnimationsPlaying";
import { useCanvasResize } from "@/application/modules/animation/hooks/useCanvasResize";
import { useGeppettoPlayer } from "@/application/modules/animation/hooks/useGeppettoPlayer";
import { usePanningAndZoom } from "@/application/modules/animation/hooks/usePanningAndZoom";
import {
  usePlayerControlValue,
  usePlayerTimestamp,
} from "@/application/modules/animation/state/PlayerControlsProvider";
import useEvent from "@/application/state/hooks/useEvent";
import {
  useControlValues,
  useControlValueSubscription,
  useMutationValues,
} from "@/application/state/ImageControlContext";

export type AnimationCanvasProps = {
  image: HTMLImageElement | null;
  activeAnimation?: string | null;
  animationsPlaying?: string[];
  onStop?: (animationId: string) => void;
  file: GeppettoImage;
};

export const AnimationCanvas: FC<PropsWithChildren<AnimationCanvasProps>> = ({
  image,
  activeAnimation,
  file,
  children,
  onStop,
  animationsPlaying = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { playerRef, animationControlsRef } = useGeppettoPlayer(
    canvasRef,
    file,
    image
  );

  // Update control values
  const updateControlValues = useEvent(
    (
      controlValues: GeppettoImage["controlValues"],
      _mutationValues: GeppettoImage["defaultFrame"]
    ) => {
      if (!animationControlsRef.current) return;

      // Update each control value in the player
      Object.entries(controlValues).forEach(([controlId, value]) => {
        try {
          const control = file.controls[controlId];
          const controlName = control?.name;
          if (controlName) {
            const maxSteps = control.steps.length - 1;
            const normalizedValue = Math.min(
              1,
              Math.max(0, maxSteps > 0 ? value / maxSteps : 0)
            );
            animationControlsRef.current?.setControlValue(
              controlName,
              normalizedValue
            );
          }
        } catch (error) {
          // Control might not exist in this animation
          console.warn(`Failed to set control ${controlId}:`, error);
        }
      });
    }
  );

  usePlayerTimestamp((time: number | null) => {
    if (
      !animationControlsRef.current ||
      activeAnimation === null ||
      activeAnimation === undefined ||
      time === null
    )
      return;
    const name = file.animations[activeAnimation]?.name;
    if (!name) return;
    animationControlsRef.current.renderAtTimestamp(name, time);
  });

  const controlValuesRef = useControlValues();
  const mutationValuesRef = useMutationValues();

  usePlayerControlValue((controlValue) => {
    if (!animationControlsRef.current) return;

    const control = file.controls[controlValue.controlId];
    const controlName = control?.name;
    if (controlName) {
      if (controlValue.value === null) {
        // If value is null, reset to current value
        animationControlsRef.current?.setControlValue(
          controlName,
          controlValuesRef.current[controlValue.controlId]
        );
        return;
      }
      const maxSteps = control.steps.length - 1;
      const normalizedValue = Math.min(
        1,
        Math.max(0, maxSteps > 0 ? controlValue.value / maxSteps : 0)
      );
      animationControlsRef.current?.setControlValue(
        controlName,
        normalizedValue
      );
    }
  });

  const subscribe = useControlValueSubscription();
  // Subscribe to control value changes
  useEffect(() => {
    if (!animationControlsRef.current) return;

    const unsubscribe = subscribe(updateControlValues);
    updateControlValues(controlValuesRef.current, mutationValuesRef.current);
    return unsubscribe;
  }, [
    controlValuesRef,
    mutationValuesRef,
    subscribe,
    updateControlValues,
    animationControlsRef,
  ]);

  useCanvasResize(image, canvasRef, playerRef);

  const { handleMouseDown, handleMouseMove, handleMouseUp } = usePanningAndZoom(
    animationControlsRef,
    canvasRef,
    image
  );

  useAnimationsPlaying(animationControlsRef, file, animationsPlaying, onStop);

  return (
    <div className="relative size-full">
      <canvas
        className="absolute inset-0 size-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
      />
      {children}
    </div>
  );
};
