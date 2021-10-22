import React, { useCallback, useMemo, useRef, ComponentProps } from "react";
import Layout from "@theme/Layout";
import { Player, Animation } from "../components/Player";
import scenery from "@site/static/demo-assets/scenery.json";
import sceneryTextureUrl from "@site/static/demo-assets/scenery.png";
import innkeeper from "@site/static/demo-assets/innkeeper.json";
import innkeeperTextureUrl from "@site/static/demo-assets/innkeeper.png";
import { AnimationControls } from "geppetto-player";
import ClickableAreas from "../components/ClickableAreas";

const Demo: React.VFC = () => {
  const animationRef = useRef<AnimationControls>();

  const getInnkeeperControls = useCallback(
    (animationControl: AnimationControls) => {
      animationControl.startTrack("Eye blink");
      animationControl.startTrack("HeadTilt");
      animationControl.startTrack("Sweeping");
    },
    []
  );

  const getSceneryControls = useCallback(
    (animationControl: AnimationControls) => {
      animationRef.current = animationControl;

      animationControl.startTrack("Wheel");
      animationControl.startTrack("WheelBlades");
      animationControl.startTrack("Tree");
      animationControl.startTrack("Bird");
      animationControl.startTrack("Cloud1", { speed: 0.15 });
      animationControl.startTrack("Cloud2", { speed: 0.1 });
      animationControl.startTrack("Cloud3", { speed: 0.15 });
      animationControl.startTrack("Day night", { speed: 0.125 });
      animationControl.startTrack("Eyes");
      animationControl.startTrack("Smoke");
      animationControl.startTrack("Water");
      animationControl.onEvent((eventName) => {
        if (eventName === "evening") {
          animationControl.startTrack("LightFlicker");
          animationControl.stopTrack("Bird");
        }
        if (eventName === "endNight") {
          animationControl.startTrack("LightOff");
        }
        if (eventName === "morning") {
          animationControl.startTrack("Bird");
        }
      });
    },
    []
  );

  const areas = useMemo<ComponentProps<typeof ClickableAreas>["areas"]>(
    () => [
      {
        id: "innkeeper",
        left: 0.203,
        right: 0.263,
        top: 0.458,
        bottom: 0.706,
        onClick: () => {
          console.log("innkeeper interact");
        },
        cursor: "pointer",
      },
    ],
    []
  );

  return (
    <Layout title="Demo">
      <ClickableAreas areas={areas}>
        <Player width={2048} height={1024}>
          <Animation
            animation={scenery}
            textureUrl={sceneryTextureUrl}
            onAnimationReady={getSceneryControls}
            options={{ zoom: 2.0 }}
          />
          <Animation
            animation={innkeeper}
            textureUrl={innkeeperTextureUrl}
            onAnimationReady={getInnkeeperControls}
            options={{
              zoom: 0.26,
              panX: -2.1,
              panY: -0.5,
              zIndex: 2,
            }}
          />
        </Player>
      </ClickableAreas>
    </Layout>
  );
};

export default Demo;
