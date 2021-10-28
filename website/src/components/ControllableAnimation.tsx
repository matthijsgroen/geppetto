import {
  PreparedImageDefinition,
  AnimationControls as GeppettoAnimationControls,
  AnimationOptions,
  ImageDefinition,
} from "geppetto-player";
import React, { FunctionComponent, useCallback, useState } from "react";
import AnimationControls from "./AnimationControls";
import LayerMouseControl from "./LayerMouseControl";
import { MouseMode } from "./MouseControl";
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

  const zoomState = useState(options.zoom || 1.0);
  const panXState = useState(options.panX || 0.0);
  const panYState = useState(options.panY || 0.0);
  const getSceneryControls = useCallback(
    (
      controls: GeppettoAnimationControls,
      animation: PreparedImageDefinition
    ) => {
      setAnimationControls([controls, animation]);
      zoomState[1](options.zoom || 1.0);
      panXState[1](options.panX || 0.0);
      panYState[1](options.panY || 0.0);
    },
    [textureUrl, animation, options, width, height]
  );

  if (controls) {
    controls.setPanning(panXState[0], panYState[0]);
    controls.setZoom(zoomState[0]);
  }

  return (
    <AnimationControls controls={controls} animation={imageDef} width={width}>
      <LayerMouseControl
        initialZoom={options.zoom || 1.0}
        zoomState={zoomState}
        panXState={panXState}
        panYState={panYState}
        width={width}
        mode={MouseMode.Grab}
      >
        <Player width={width} height={height}>
          <Animation
            animation={animation}
            textureUrl={textureUrl}
            onAnimationReady={getSceneryControls}
            options={options}
          />
        </Player>
      </LayerMouseControl>
    </AnimationControls>
  );
};

export default ControllableAnimation;
