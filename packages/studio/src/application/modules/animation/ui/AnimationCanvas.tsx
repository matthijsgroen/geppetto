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

import useEvent from "@/application/state/hooks/useEvent";
import {
  useControlValues,
  useControlValueSubscription,
  useMutationValues,
} from "@/application/state/ImageControlContext";
import {
  useScreenSubscription,
  useScreenTranslation,
  useUpdateScreenTranslation,
} from "@/application/state/ScreenTranslationContext";
import {
  getInitialScale,
  maxZoomFactor,
} from "@/infrastructure/webgl/lib/canvas";

export type AnimationCanvasProps = {
  image: HTMLImageElement | null;
  file: GeppettoImage;
  ref?: RefObject<HTMLDivElement | null>;
};

export const AnimationCanvas: FC<PropsWithChildren<AnimationCanvasProps>> = ({
  image,
  file,
  children,
  ref,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<GeppettoPlayer | null>(null);
  const animationControlsRef = useRef<AnimationControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const mouseDeltaRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const translation = useScreenTranslation();
  const updateScreenTranslation = useUpdateScreenTranslation();
  const subscribeScreenTranslation = useScreenSubscription();
  const controlValuesRef = useControlValues();
  const mutationValuesRef = useMutationValues();
  const subscribe = useControlValueSubscription();

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

  // Subscribe to translation changes and update player viewport
  useEffect(() => {
    const unsubscribe = subscribeScreenTranslation((trans) => {
      if (!animationControlsRef.current) return;
      animationControlsRef.current.setZoom(trans.zoom);
      animationControlsRef.current.setPanning(trans.panX, trans.panY);
      // If the player needs to react to scale, add logic here
    });
    return unsubscribe;
  }, [subscribeScreenTranslation]);

  // Mouse event handlers for panning
  const handleMouseDown = useEvent((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    if (!containerRef.current || !animationControlsRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    isDraggingRef.current = true;
    lastMousePosRef.current = { x: mouseX, y: mouseY };
    mouseDeltaRef.current = { x: 0, y: 0 };
  });

  const handleMouseMove = useEvent((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (
      !isDraggingRef.current ||
      !lastMousePosRef.current ||
      !animationControlsRef.current ||
      !containerRef.current
    )
      return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const totalDeltaX = mouseX - lastMousePosRef.current.x;
    const totalDeltaY = mouseY - lastMousePosRef.current.y;

    // Calculate incremental delta since last move
    const deltaX = totalDeltaX - mouseDeltaRef.current.x;
    const deltaY = totalDeltaY - mouseDeltaRef.current.y;
    mouseDeltaRef.current = { x: totalDeltaX, y: totalDeltaY };

    // Get current viewport from player
    const viewport = animationControlsRef.current.getViewport();

    // Player's pan coordinate space: ±1 = half canvas width (independent of zoom/scale)
    // deltaPan = deltaPixels / (canvasWidth / 2) = deltaPixels * 2 / canvasWidth
    const newPanX = Math.min(
      1.0,
      Math.max(-1.0, viewport.panX + (deltaX * 2) / rect.width)
    );

    const newPanY = Math.min(
      1.0,
      Math.max(-1.0, viewport.panY - (deltaY * 2) / rect.height)
    );

    // Update player directly
    animationControlsRef.current.setPanning(newPanX, newPanY);

    // Sync with context
    updateScreenTranslation((trans) => ({
      ...trans,
      panX: newPanX,
      panY: newPanY,
    }));
  });

  const handleMouseUp = useEvent(() => {
    isDraggingRef.current = false;
    lastMousePosRef.current = null;
    mouseDeltaRef.current = { x: 0, y: 0 };
  });

  const handleWheel = useEvent((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!animationControlsRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Get current viewport
    const viewport = animationControlsRef.current.getViewport();
    const maxZoom = maxZoomFactor(image);

    // Calculate new zoom
    const newZoom = Math.min(
      maxZoom,
      Math.max(0.1, viewport.zoom - e.deltaY / 100)
    );

    if (newZoom === viewport.zoom) return;

    // Convert mouse position to normalized coordinates relative to canvas center
    // Canvas center is (0, 0), edges are at (-1, -1) to (1, 1)
    const normalizedMouseX = (mouseX / rect.width) * 2 - 1;
    const normalizedMouseY = 1 - (mouseY / rect.height) * 2;

    // Calculate the position in the zoomed space before zoom change
    // The mouse points to a specific location in the image coordinate space
    const imagePointX = (normalizedMouseX - viewport.panX) / viewport.zoom;
    const imagePointY = (normalizedMouseY - viewport.panY) / viewport.zoom;

    // After zoom, we want the same image point to be under the mouse
    // So we solve for the new pan: normalizedMouse = newPan + imagePoint * newZoom
    const newPanX = normalizedMouseX - imagePointX * newZoom;
    const newPanY = normalizedMouseY - imagePointY * newZoom;

    // Update player directly
    animationControlsRef.current.setZoom(newZoom);
    animationControlsRef.current.setPanning(newPanX, newPanY);

    // Sync with context
    updateScreenTranslation((trans) => ({
      ...trans,
      zoom: newZoom,
      panX: newPanX,
      panY: newPanY,
    }));
  });

  // Attach wheel event with passive: false to allow preventDefault
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheelHandler = (e: WheelEvent) => {
      handleWheel(e as unknown as React.WheelEvent<HTMLCanvasElement>);
    };

    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, [handleWheel]);

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
