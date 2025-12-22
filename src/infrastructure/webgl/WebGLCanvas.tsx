import {
  type FC,
  type PropsWithChildren,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  type Subscription,
  useScreenSubscription,
} from "@/application/state/ScreenTranslationContext";
import { mergeRefs } from "@/shared/utils/mergeRefs";

import { type WebGLRenderer, webGLScene } from "./lib/webgl";

const HEIGHT_PIXEL_FIX = 4;

const startWebGL = async (
  node: HTMLCanvasElement,
  container: HTMLDivElement,
  renderers: WebGLRenderer[],
  subscribe: Subscription
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
  const unsubscribe = subscribe(() => {
    markChanged();
  });

  api.onChange(markChanged);

  const onResize = () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const rect = container.getBoundingClientRect();
      node.width = rect.width * window.devicePixelRatio;
      node.height = (rect.height - HEIGHT_PIXEL_FIX) * window.devicePixelRatio;
      container.dispatchEvent(new Event("resize"));
      markChanged();
    }, 5);
  };
  const resizeObserver = new ResizeObserver(() => {
    onResize();
  });

  resizeObserver.observe(container);

  return () => {
    unsubscribe();
    api.cleanup();
    resizeObserver.disconnect();
  };
};

type WebGLCanvasProps = PropsWithChildren<{
  renderers: WebGLRenderer[];
  ref?: RefObject<HTMLDivElement | null>;
}>;

const WebGLCanvas: FC<WebGLCanvasProps> = ({ renderers, children, ref }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const subscribe = useScreenSubscription();

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

      startWebGL(node, containerRef.current, renderers, subscribe).then(
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
        cleanup?.();
      };
    }
  }, [renderers, mounted, subscribe]);

  return (
    <div
      ref={mergeRefs([ref, containerRef])}
      className="relative size-full overflow-hidden"
    >
      {children}
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
};

export default WebGLCanvas;
