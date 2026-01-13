import type { GeppettoPlayer } from "geppetto-player";
import { useEffect } from "react";

import { useUpdateScreenTranslation } from "@/application/state/ScreenTranslationContext";
import { getInitialScale } from "@/infrastructure/webgl/lib/canvas";

export const useCanvasResize = (
  image: HTMLImageElement | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  playerRef: React.RefObject<GeppettoPlayer | null>
) => {
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
  }, [image, updateScreenTranslation, playerRef, canvasRef]);
};
