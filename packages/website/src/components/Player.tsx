import React, {
  Children,
  createContext,
  FC,
  PropsWithChildren,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { setupWebGL, prepareAnimation } from "geppetto-player";
import type {
  GeppettoPlayer,
  GeppettoImage,
  AnimationControls,
  AnimationOptions,
  PreparedImageDefinition,
} from "geppetto-player";

type PlayerProps = {
  width: number;
  height: number;
  fallbackUrl?: string;
  onRender?: () => void;
};

type ContextValueType = ((
  animation: PreparedImageDefinition,
  textureUrl: string,
  options?: Partial<AnimationOptions>
) => Promise<[AnimationControls, () => void]>) | null;

const PlayerContext = createContext<ContextValueType>(null);

export const Player: FC<PropsWithChildren<PlayerProps>> = ({
  width,
  height,
  fallbackUrl,
  children,
  onRender,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animations = useRef<AnimationControls[]>([]);
  const animationDataPrepped = useRef<boolean[]>(
    Array(Children.count(children)).fill(false)
  );
  const animationResolvers = useRef<((player: GeppettoPlayer) => void)[]>([]);
  const playerMounted = useRef<boolean>(true);

  const preparePlayer = useCallback(
    async (animationList: RefObject<boolean[]>) =>
      new Promise<GeppettoPlayer>((resolve) => {
        animationResolvers.current.push(resolve);

        if (animationList.current.every((e) => e) && canvasRef.current) {
          const player = setupWebGL(canvasRef.current);

          const renderFrame = () => {
            if (!playerMounted.current) {
              player.destroy();
              return;
            }
            player.render();
            animations.current.forEach(
              (animation) => animation && animation.render()
            );
            if (onRender) {
              onRender();
            }
            window.requestAnimationFrame(renderFrame);
          };
          animationResolvers.current.forEach((f) => f(player));

          window.requestAnimationFrame(renderFrame);
        }
      }),
    []
  );

  const addAnimation = useCallback(
    async (
      animation: PreparedImageDefinition,
      textureUrl: string,
      options?: Partial<AnimationOptions>
    ): Promise<[AnimationControls, () => void]> => {
      const index = animations.current.length;
      const texture = await loadTexture(textureUrl);
      animationDataPrepped.current[index] = true;
      const player: GeppettoPlayer = await preparePlayer(animationDataPrepped);

      const controls = player.addAnimation(animation, texture, index, options);
      animations.current.push(controls);

      return [
        controls,
        () => {
          animations.current = animations.current.filter((e) => e !== controls);
          controls.destroy();
        },
      ];
    },
    []
  );

  useEffect(() => {
    return () => {
      playerMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const setCanvasSize = () => {
      if (!canvasRef.current) return;
      const box = canvasRef.current.getBoundingClientRect();
      const override = navigator.userAgent.includes("SMART-TV") ? 2 : 1;
      canvasRef.current.width = Math.min(
        width * window.devicePixelRatio * override,
        box.width * window.devicePixelRatio * override
      );
      canvasRef.current.height = Math.min(
        height * window.devicePixelRatio * override,
        box.height * window.devicePixelRatio * override
      );
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [width, height]);

  return (
    <>
      <PlayerContext.Provider value={addAnimation}>
        {children}
      </PlayerContext.Provider>
      <canvas
        ref={canvasRef}
        style={{
          aspectRatio: `${width} / ${height}`,
          width: `min(${width}px, 100%)`,
          ...(fallbackUrl
            ? {
                backgroundImage: `url("${fallbackUrl}")`,
                backgroundSize: "cover",
              }
            : {}),
        }}
      />
    </>
  );
};

const loadTexture = async (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
  });

type AnimationProps = {
  animation: GeppettoImage;
  textureUrl: string;
  options?: Partial<AnimationOptions>;
  onAnimationReady: (
    animationControls: AnimationControls,
    animation: PreparedImageDefinition
  ) => void;
};

export const Animation: React.FC<AnimationProps> = ({
  animation,
  textureUrl,
  options,
  onAnimationReady,
}) => {
  const destroyRef = useRef(() => {});
  const animationSet = useRef("");

  useEffect(() => {
    return () => {
      destroyRef.current();
    };
  }, []);

  return (
    <PlayerContext.Consumer>
      {(addAnimation) => {
        if (typeof addAnimation !== "function") return null;
        (async () => {
          if (animationSet.current === textureUrl) return;
          animationSet.current = textureUrl;
          destroyRef.current();
          const preparedAnimation = prepareAnimation(animation);
          const [controls, destroy] = await addAnimation(
            preparedAnimation,
            textureUrl,
            options
          );
          destroyRef.current = destroy;
          onAnimationReady(controls, preparedAnimation);
        })();

        return null;
      }}
    </PlayerContext.Consumer>
  );
};
