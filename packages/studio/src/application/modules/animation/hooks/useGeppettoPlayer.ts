import type {
  AnimationControls,
  GeppettoImage,
  GeppettoPlayer,
} from "geppetto-player";
import { prepareAnimation, setupWebGL } from "geppetto-player";
import { type RefObject, useEffect, useRef } from "react";

import {
  useScreenTranslation,
  useUpdateScreenTranslation,
} from "@/application/state/ScreenTranslationContext";
import { getInitialScale } from "@/infrastructure/webgl/lib/canvas";

export const useGeppettoPlayer = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  file: GeppettoImage,
  image: HTMLImageElement | null
) => {
  const animationFrameRef = useRef<number | null>(null);
  const translation = useScreenTranslation();
  const playerRef = useRef<GeppettoPlayer | null>(null);
  const animationControlsRef = useRef<AnimationControls | null>(null);

  // Initialize WebGL player
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    if (playerRef.current) return; // Already initialized

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
        disableAutoplay: true,
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
  }, [
    image,
    file,
    canvasRef,
    translation.panX,
    translation.panY,
    translation.zoom,
  ]);

  const updateScreenTranslation = useUpdateScreenTranslation();
  // Calculate the scale factor of how the image fits in the canvas
  useEffect(() => {
    if (!canvasRef.current || !image) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scale = getInitialScale(
      [rect.width, rect.height],
      [image.width, image.height]
    );

    // Update scale in translation context
    updateScreenTranslation((trans) => ({
      ...trans,
      scale,
    }));
  }, [image, updateScreenTranslation, canvasRef]);

  return { playerRef, animationControlsRef };
};
