import React, { useEffect, useRef } from "react";
import { WebGLRenderer, webGLScene } from "../lib/webgl";

const startWebGL = async (
  node: HTMLCanvasElement,
  renderers: WebGLRenderer[]
): Promise<() => void> => {
  const rect = node.getBoundingClientRect();
  node.width = rect.width * window.devicePixelRatio;
  node.height = rect.height * window.devicePixelRatio;

  const api = await webGLScene(node, renderers);
  api.render();
  let debounce: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const rect = node.getBoundingClientRect();
      node.width = rect.width * window.devicePixelRatio;
      node.height = rect.height * window.devicePixelRatio;
      api.render();
    }, 50);
  };
  window.addEventListener("resize", onResize);

  return () => {
    api.cleanup();
    window.removeEventListener("resize", onResize);
  };
};

export interface TextureMapCanvasProps {
  renderers: WebGLRenderer[];
}

const WebGLCanvas: React.FC<TextureMapCanvasProps> = ({ renderers }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref && ref.current) {
      const node = ref.current;
      let cleanup: () => void;

      startWebGL(node, renderers).then((result) => {
        cleanup = result;
      });
      return () => {
        // unmount
        cleanup && cleanup();
      };
    }
  }, [ref, renderers]);

  return <canvas ref={ref} style={{ width: "100%", height: "100%" }} />;
};

export default WebGLCanvas;
