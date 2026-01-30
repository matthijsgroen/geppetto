import type { AnimationControls } from "geppetto-player";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import useEvent from "@/application/state/hooks/useEvent";
import {
  useScreenSubscription,
  useUpdateScreenTranslation,
} from "@/application/state/ScreenTranslationContext";
import { maxZoomFactor } from "@/infrastructure/webgl/lib/canvas";

export const usePanningAndZoom = (
  animationControlsRef: RefObject<AnimationControls | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  image: HTMLImageElement | null
) => {
  const subscribeScreenTranslation = useScreenSubscription();
  const updateScreenTranslation = useUpdateScreenTranslation();

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const mouseDeltaRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Subscribe to translation changes and update player viewport
  useEffect(() => {
    const unsubscribe = subscribeScreenTranslation((trans) => {
      if (!animationControlsRef.current) return;
      animationControlsRef.current.setZoom(trans.zoom);
      animationControlsRef.current.setPanning(trans.panX, trans.panY);
      // If the player needs to react to scale, add logic here
    });
    return unsubscribe;
  }, [subscribeScreenTranslation, animationControlsRef]);

  // Mouse event handlers for panning
  const handleMouseDown = useEvent((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    if (!canvasRef.current || !animationControlsRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
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
      !canvasRef.current
    )
      return;

    const rect = canvasRef.current.getBoundingClientRect();
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

    const newPanX = viewport.panX + (deltaX * 2) / rect.width;
    const newPanY = viewport.panY - (deltaY * 2) / rect.height;

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
    if (!animationControlsRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
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
    const container = canvasRef.current;
    if (!container) return;

    const wheelHandler = (e: WheelEvent) => {
      handleWheel(e as unknown as React.WheelEvent<HTMLCanvasElement>);
    };

    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, [handleWheel, canvasRef]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
  };
};
