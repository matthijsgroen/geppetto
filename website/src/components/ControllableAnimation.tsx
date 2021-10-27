import {
  PreparedImageDefinition,
  AnimationControls as GeppettoAnimationControls,
  AnimationOptions,
  ImageDefinition,
} from "geppetto-player";
import React, { FunctionComponent, useCallback, useState } from "react";
import AnimationControls from "./AnimationControls";
import { Player, Animation } from "./Player";

type Props = {
  textureUrl: string;
  animation: ImageDefinition;
  options: Partial<AnimationOptions>;
  width: number;
  height: number;
};

const ControllableAnimation: FunctionComponent<Props> = ({
  textureUrl,
  animation,
  options,
  width,
  height,
}) => {
  const [[controls, imageDef], setAnimationControls] = useState<
    [GeppettoAnimationControls, PreparedImageDefinition]
  >([undefined, undefined]);

  const getSceneryControls = useCallback(
    (
      controls: GeppettoAnimationControls,
      animation: PreparedImageDefinition
    ) => {
      setAnimationControls([controls, animation]);
    },
    [textureUrl, animation, options, width, height]
  );

  return (
    <AnimationControls controls={controls} animation={imageDef} width={width}>
      <Player width={width} height={height}>
        <Animation
          animation={animation}
          textureUrl={textureUrl}
          onAnimationReady={getSceneryControls}
          options={options}
        />
      </Player>
    </AnimationControls>
  );
};

export default ControllableAnimation;
