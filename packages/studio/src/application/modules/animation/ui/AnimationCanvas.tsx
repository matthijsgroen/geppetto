import type { GeppettoImage } from "@geppetto/types";
import { type FC, type PropsWithChildren, useEffect, useRef } from "react";

import { useAnimationsPlaying } from "@/application/modules/animation/hooks/useAnimationsPlaying";
import { useGeppettoPlayer } from "@/application/modules/animation/hooks/useGeppettoPlayer";
import { usePanningAndZoom } from "@/application/modules/animation/hooks/usePanningAndZoom";
import useEvent from "@/application/state/hooks/useEvent";
import {
  useControlValues,
  useControlValueSubscription,
  useMutationValues,
} from "@/application/state/ImageControlContext";
import { useUpdateScreenTranslation } from "@/application/state/ScreenTranslationContext";
import { getInitialScale } from "@/infrastructure/webgl/lib/canvas";

export type AnimationCanvasProps = {
  image: HTMLImageElement | null;
  animationsPlaying?: string[];
  file: GeppettoImage;
};

export const AnimationCanvas: FC<PropsWithChildren<AnimationCanvasProps>> = ({
  image,
  file,
  children,
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

  const controlValuesRef = useControlValues();
  const mutationValuesRef = useMutationValues();
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

  const updateScreenTranslation = useUpdateScreenTranslation();
  // Update canvas size on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const pixelRatio =
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      // Only set the buffer size, not the style (CSS handles the display size)
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      // Recalculate scale when canvas size changes
      if (image) {
        const newScale = getInitialScale(
          [width, height],
          [image.width, image.height]
        );
        // imageScaleRef removed; use translation.scale from context
        updateScreenTranslation((trans) => ({
          ...trans,
          scale: newScale,
        }));
      }

      // Render immediately after resizing to prevent flashing
      // (canvas.width/height assignment clears the drawing buffer)
      playerRef.current?.render();
    };

    updateCanvasSize();

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [image, updateScreenTranslation, animationControlsRef, playerRef]);

  const { handleMouseDown, handleMouseMove, handleMouseUp } = usePanningAndZoom(
    animationControlsRef,
    canvasRef,
    image
  );

  useAnimationsPlaying(animationControlsRef, file, animationsPlaying);

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
