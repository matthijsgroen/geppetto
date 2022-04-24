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

const FPSIndicator = styled.div`
  position: absolute;
  top: 0;
  right: 10px;
  color: ${({ theme }) => theme.colors.textDefault};
`;

const startWebGL = async (
  node: HTMLCanvasElement,
  container: HTMLDivElement,
  renderers: WebGLRenderer[],
  debugRef: React.RefObject<HTMLElement>,
  instId: string
): Promise<() => void> => {
  const rect = container.getBoundingClientRect();
  node.width = rect.width * window.devicePixelRatio;
  node.height = (rect.height - HEIGHT_PIXEL_FIX) * window.devicePixelRatio;

  const api = await webGLScene(node, renderers, instId);
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
  window.addEventListener("resize", onResize);
  let renderLoop = true;

  let slowest = 0;
  const render = () => {
    if (!renderLoop) {
      api.cleanup();
      return;
    }
    const st = +new Date();
    api.render();
    const renderMs = +new Date() - st;
    slowest = Math.max(slowest, renderMs);
    if (debugRef.current) {
      debugRef.current.textContent = `Frame: ${renderMs}ms Slowest: ${slowest}ms`;
    }
    window.requestAnimationFrame(render);
  };
  window.requestAnimationFrame(render);

  return () => {
    renderLoop = false;
    window.removeEventListener("resize", onResize);
  };
};

export interface WebGLCanvasProps {
  renderers: WebGLRenderer[];
  showFPS?: boolean;
}

let instance = 0;
const getInstance = () => {
  return `inst${instance++}`;
};

const WebGLCanvas: React.FC<WebGLCanvasProps> = ({
  renderers,
  showFPS = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);

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
      containerRef.current &&
      debugRef
      // debugRef.current
    ) {
      const instId = getInstance();
      const node = canvasRef.current;
      let mounted = true;
      let cleanup: () => void;

      startWebGL(node, containerRef.current, renderers, debugRef, instId).then(
        (result) => {
          cleanup = result;
          if (!mounted) {
            cleanup();
          }
        }
      );
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
      {showFPS && (
        <FPSIndicator
          ref={debugRef}
          style={{ display: showFPS ? "block" : "none" }}
        />
      )}
    </CanvasContainer>
  );
};

export default WebGLCanvas;
