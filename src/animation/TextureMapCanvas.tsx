import React, { useEffect, useRef } from "react";
import { ShapesDefinition } from "../lib/types";
import { webGLScene } from "../lib/webgl";
import { showTexture } from "./programs/showTexture";
import { showTextureMap } from "./programs/showTextureMap";

const loadImage = async (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.addEventListener("load", () => {
      resolve(img);
    });
    img.src = url;
  });

const startWebGL = async (
  node: HTMLCanvasElement,
  url: string,
  shapes: ShapesDefinition[]
): Promise<() => void> => {
  const rect = node.getBoundingClientRect();
  node.width = rect.width * window.devicePixelRatio;
  node.height = rect.height * window.devicePixelRatio;

  const image = await loadImage(url);

  const api = await webGLScene(node, [
    showTexture(image),
    showTextureMap(image, shapes),
  ]);
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
  url: string;
  shapes: ShapesDefinition[];
}

const TextureMapCanvas: React.FC<TextureMapCanvasProps> = ({ url, shapes }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref && ref.current) {
      const node = ref.current;
      let cleanup: () => void;
      startWebGL(node, url, shapes).then((result) => {
        cleanup = result;
      });
      return () => {
        // unmount
        cleanup && cleanup();
      };
    }
  }, [ref, url]);

  return <canvas ref={ref} style={{ width: "100%", height: "100%" }} />;
};

export default TextureMapCanvas;
