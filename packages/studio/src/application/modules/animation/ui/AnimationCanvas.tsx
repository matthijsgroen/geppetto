import type { GeppettoImage } from "@geppetto/types";
import type { AnimationControls, GeppettoPlayer } from "geppetto-player";
import { prepareAnimation, setupWebGL } from "geppetto-player";
import {
  type FC,
  type PropsWithChildren,
  type RefObject,
  useEffect,
  useRef,
} from "react";

import { useAnimationsPlaying } from "@/application/modules/animation/hooks/useAnimationsPlaying";
import { usePanningAndZoom } from "@/application/modules/animation/hooks/usePanningAndZoom";
import useEvent from "@/application/state/hooks/useEvent";
import {
  useControlValues,
  useControlValueSubscription,
  useMutationValues,
} from "@/application/state/ImageControlContext";
import {
  useScreenTranslation,
  useUpdateScreenTranslation,
} from "@/application/state/ScreenTranslationContext";
import { getInitialScale } from "@/infrastructure/webgl/lib/canvas";

export type AnimationCanvasProps = {
  image: HTMLImageElement | null;
  animationsPlaying?: string[];
  file: GeppettoImage;
  ref?: RefObject<HTMLDivElement | null>;
};

export const AnimationCanvas: FC<PropsWithChildren<AnimationCanvasProps>> = ({
  image,
  file,
  children,
  ref,
  animationsPlaying = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<GeppettoPlayer | null>(null);
  const animationControlsRef = useRef<AnimationControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const translation = useScreenTranslation();

  // Initialize WebGL player
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    try {
      // Setup WebGL and player
      const player = setupWebGL(canvas);
      playerRef.current = player;

      // Prepare animation from file
      const preparedAnimation = prepareAnimation(file);

      // Add animation to player
      const controls = player.addAnimation(preparedAnimation, image, 0, {
        fitMode: "contain",
        zoom: translation.zoom,
        panX: translation.panX,
        panY: translation.panY,
        pixelDensity:
          typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      });

      animationControlsRef.current = controls;

      // Start render loop
      const render = () => {
        if (playerRef.current) {
          playerRef.current.render();
          animationFrameRef.current = requestAnimationFrame(render);
        }
      };
      animationFrameRef.current = requestAnimationFrame(render);
    } catch (error) {
      console.error("Failed to initialize animation player:", error);
    }

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (animationControlsRef.current) {
        animationControlsRef.current.destroy();
        animationControlsRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [image, file]);

  const updateScreenTranslation = useUpdateScreenTranslation();
  // Calculate the scale factor of how the image fits in the canvas
  useEffect(() => {
    if (!containerRef.current || !image) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scale = getInitialScale(
      [rect.width, rect.height],
      [image.width, image.height]
    );

    // Update scale in translation context
    updateScreenTranslation((trans) => ({
      ...trans,
      scale,
    }));
  }, [image, updateScreenTranslation]);

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
  }, [controlValuesRef, mutationValuesRef, subscribe, updateControlValues]);

  // Update canvas size on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const updateCanvasSize = () => {
      const { width, height } = container.getBoundingClientRect();
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
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [image, updateScreenTranslation]);

  const { handleMouseDown, handleMouseMove, handleMouseUp } = usePanningAndZoom(
    animationControlsRef,
    containerRef,
    image
  );

  useAnimationsPlaying(animationControlsRef, file, animationsPlaying);

  return (
    <div
      className="relative size-full cursor-grab active:cursor-grabbing"
      ref={containerRef}
    >
      <div className="relative size-full overflow-hidden" ref={ref}>
        <canvas
          className="absolute inset-0 size-full"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={canvasRef}
        />
      </div>
      {children}
    </div>
  );
};
