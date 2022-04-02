import React, { useEffect, useRef } from "react";
import { WebGLRenderer, webGLScene } from "../lib/webgl";
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
  debugRef: HTMLElement
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
  window.addEventListener("resize", onResize);
  let renderLoop = true;
  let slowest = 0;
  const render = () => {
    if (!renderLoop) return;
    const st = +new Date();
    api.render();
    const renderMs = +new Date() - st;
    slowest = Math.max(slowest, renderMs);
    debugRef.textContent = `Frame: ${renderMs}ms Slowest: ${slowest}ms`;
    window.requestAnimationFrame(render);
  };
  window.requestAnimationFrame(render);

  return () => {
    api.cleanup();
    renderLoop = false;
    window.removeEventListener("resize", onResize);
  };
};

export interface WebGLCanvasProps {
  renderers: WebGLRenderer[];
  showFPS?: boolean;
}

const WebGLCanvas: React.FC<WebGLCanvasProps> = ({
  renderers,
  showFPS = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      canvasRef &&
      canvasRef.current &&
      containerRef &&
      containerRef.current &&
      debugRef &&
      debugRef.current
    ) {
      const node = canvasRef.current;
      let cleanup: () => void;

      startWebGL(node, containerRef.current, renderers, debugRef.current).then(
        (result) => {
          cleanup = result;
        }
      );
      return () => {
        // unmount
        cleanup && cleanup();
      };
    }
  }, []);

  return (
    <CanvasContainer ref={containerRef}>
      <canvas ref={canvasRef} />
      <FPSIndicator
        ref={debugRef}
        style={{ display: showFPS ? "block" : "none" }}
      />
    </CanvasContainer>
  );
};

export default WebGLCanvas;
