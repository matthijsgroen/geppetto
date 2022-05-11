import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
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

  let dirty = false;
  const render = () => {
    api.render();
    dirty = false;
  };

  const markChanged = () => {
    if (!dirty) {
      dirty = true;
      window.requestAnimationFrame(render);
    }
  };

  api.onChange(markChanged);

  const onResize = () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const rect = container.getBoundingClientRect();
      node.width = rect.width * window.devicePixelRatio;
      node.height = (rect.height - HEIGHT_PIXEL_FIX) * window.devicePixelRatio;
      markChanged();
    }, 5);
  };
  const resizeObserver = new ResizeObserver((entries) => {
    onResize();
  });

  resizeObserver.observe(container);

  return () => {
    api.cleanup();
    resizeObserver.disconnect();
  };
};

export interface WebGLCanvasProps {
  renderers: WebGLRenderer[];
}

const WebGLCanvas: React.FC<PropsWithChildren<WebGLCanvasProps>> = ({
  renderers,
  children,
}) => {
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
      {children}
      <canvas ref={canvasRef} />
    </CanvasContainer>
  );
};

export default WebGLCanvas;
