import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  setupWebGL,
  prepareAnimation,
  GeppettoPlayer,
  ImageDefinition,
  AnimationControls,
  PreparedAnimation,
  AnimationOptions,
  PreparedImageDefinition,
} from "geppetto-player";

type PlayerProps = {
  width: number;
  height: number;
};

const PlayerContext =
  React.createContext<
    (
      animation: PreparedImageDefinition,
      texture: HTMLImageElement,
      options?: Partial<AnimationOptions>
    ) => [AnimationControls, () => void]
  >(null);

export const Player: React.FC<PlayerProps> = ({ width, height, children }) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const [player, setPlayer] = useState<GeppettoPlayer>(null);
  const animations = useRef<AnimationControls[]>([]);

  const playerActive = useRef<boolean>(true);

  const addAnimation = useCallback(
    (
      animation: PreparedImageDefinition,
      texture: HTMLImageElement,
      options?: Partial<AnimationOptions>
    ): [AnimationControls, () => void] => {
      const controls = player.addAnimation(
        animation,
        texture,
        animations.current.length,
        options
      );
      animations.current.push(controls);

      return [
        controls,
        () => {
          animations.current = animations.current.filter((e) => e !== controls);
          controls.destroy();
        },
      ];
    },
    [player]
  );

  useEffect(() => {
    const player = setupWebGL(canvasRef.current);
    setPlayer(player);

    const renderFrame = () => {
      if (!playerActive.current) {
        return;
      }
      player.render();
      animations.current.forEach((animation) => animation.render());
      window.requestAnimationFrame(renderFrame);
    };

    window.requestAnimationFrame(renderFrame);

    const setCanvasSize = () => {
      const box = canvasRef.current.getBoundingClientRect();
      const override = navigator.userAgent.includes("SMART-TV") ? 2 : 1;
      canvasRef.current.width = Math.min(
        width,
        box.width * window.devicePixelRatio * override
      );
      canvasRef.current.height = Math.min(
        height,
        box.height * window.devicePixelRatio * override
      );
    };

    setCanvasSize();
    const resizeListener = () => {
      setCanvasSize();
    };
    window.addEventListener("resize", resizeListener);

    return () => {
      player.destroy();
      window.removeEventListener("resize", resizeListener);
      playerActive.current = false;
    };
  }, []);

  return (
    <>
      <PlayerContext.Provider value={player && addAnimation}>
        {children}
      </PlayerContext.Provider>
      <canvas
        ref={canvasRef}
        style={{
          aspectRatio: `${width / height}`,
          width: "100%",
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
  animation: ImageDefinition;
  textureUrl: string;
  options?: Partial<AnimationOptions>;
  onAnimationReady: (animationControls: AnimationControls) => void;
};

export const Animation: React.VFC<AnimationProps> = ({
  animation,
  textureUrl,
  options,
  onAnimationReady,
}) => {
  const destroyRef = useRef(() => {});
  useEffect(() => {
    return () => {
      destroyRef.current();
    };
  }, []);

  return (
    <PlayerContext.Consumer>
      {(addAnimation) => {
        if (typeof addAnimation !== "function") return null;
        const preparedAnimation = prepareAnimation(animation);
        loadTexture(textureUrl).then((imageElement) => {
          const [controls, destroy] = addAnimation(
            preparedAnimation,
            imageElement,
            options
          );
          destroyRef.current = destroy;
          onAnimationReady(controls);
        });

        return null;
      }}
    </PlayerContext.Consumer>
  );
};