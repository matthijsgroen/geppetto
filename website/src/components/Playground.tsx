import { AnimationOptions, ImageDefinition } from "geppetto-player";
import React, { FunctionComponent, useState } from "react";

import scenery from "@site/static/demo-assets/scenery.json";
import sceneryTextureUrl from "@site/static/demo-assets/scenery.png";
import innkeeper from "@site/static/demo-assets/innkeeper.json";
import innkeeperTextureUrl from "@site/static/demo-assets/innkeeper.png";
import AnimationSelector from "./AnimationSelector";
import ControllableAnimation from "./ControllableAnimation";

export type AnimationSelection = {
  id: string;
  label: string;
  textureUrl: string;
  animation: ImageDefinition;
  options: Partial<AnimationOptions>;
  width: number;
  height: number;
};

export const animations: AnimationSelection[] = [
  {
    id: "scenery",
    label: "Scenery",
    animation: scenery,
    textureUrl: sceneryTextureUrl,
    options: { zoom: 2.0 },
    width: 2048,
    height: 1024,
  },
  {
    id: "innkeeper",
    label: "Innkeeper",
    animation: innkeeper,
    textureUrl: innkeeperTextureUrl,
    options: { zoom: 1.0, panY: 0.75 },
    width: 800,
    height: 800,
  },
];

const Playground: FunctionComponent = () => {
  const [animationData, setAnimationData] = useState<AnimationSelection>(
    animations[0]
  );
  return (
    <>
      <AnimationSelector
        onSelect={setAnimationData}
        active={animationData}
        options={animations}
      />
      <ControllableAnimation
        width={animationData.width}
        height={animationData.height}
        animation={animationData.animation}
        textureUrl={animationData.textureUrl}
        options={animationData.options}
      />
    </>
  );
};

export default Playground;
