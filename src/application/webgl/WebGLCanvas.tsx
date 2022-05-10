import React, { useEffect, useRef, useState } from "react";
import { WebGLRenderer, webGLScene } from "./lib/webgl";
import styled from "styled-components";

const HEIGHT_PIXEL_FIX = 4;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  canvas {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100% !important;
    height: 100% !important;
  }
`;

const startWebGL = async (
  node: HTMLCanvasElement,
  container: HTMLDivElement,
  renderers: WebGLRenderer[]
): Promise<() => void> => {
  const rect = container.getBoundingClientRect();
  node.width = rect.width * window.devicePixelRatio;
  node.height = (rect.height - HEIGHT_PIXEL_FIX) * window.devicePixelRatio;

  const api = await webGLScene(node, renderers);
  api.render();
  let debounce: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const rect = container.getBoundingClientRect();
      node.width = rect.width * window.devicePixelRatio;
      node.height = (rect.height - HEIGHT_PIXEL_FIX) * window.devicePixelRatio;
      api.render();
    }, 50);
  };

  // TODO change to ResizeObserver hook
  window.addEventListener("resize", onResize);
  let dirty = false;
  const render = () => {
    api.render();
    dirty = false;
  };

  api.onChange(() => {
    if (!dirty) {
      dirty = true;
      window.requestAnimationFrame(render);
    }
  });

  return () => {
    api.cleanup();
    window.removeEventListener("resize", onResize);
  };
};

export interface WebGLCanvasProps {
  renderers: WebGLRenderer[];
}

const WebGLCanvas: React.FC<WebGLCanvasProps> = ({ renderers }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMounted(true);
    }, 10);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (
      mounted &&
      canvasRef &&
      canvasRef.current &&
      containerRef &&
      containerRef.current
    ) {
      const node = canvasRef.current;
      let mounted = true;
      let cleanup: () => void;

      startWebGL(node, containerRef.current, renderers).then((result) => {
        cleanup = result;
        if (!mounted) {
          cleanup();
        }
      });
      return () => {
        mounted = false;
        // unmount
        cleanup && cleanup();
      };
    }
  }, [renderers, mounted]);

  return (
    <CanvasContainer ref={containerRef}>
      <canvas ref={canvasRef} />
    </CanvasContainer>
  );
};

export default WebGLCanvas;
