import React, {
  useCallback,
  useMemo,
  useRef,
  ComponentProps,
  useState,
} from "react";
import { Player, Animation } from "./Player";
import scenery from "@site/static/demo-assets/scenery.json";
import sceneryTextureUrl from "@site/static/demo-assets/scenery.png";
import innkeeper from "@site/static/demo-assets/innkeeper.json";
import innkeeperTextureUrl from "@site/static/demo-assets/innkeeper.png";
import { AnimationControls } from "geppetto-player";
import ClickableAreas from "./ClickableAreas";
import { animationTween, delayFrames, tick } from "./tween";
import Dialog from "./Dialog";

const innKeeperClose = {
  zoom: 2.2,
  panX: -0.3,
  panY: 0.1,
  zIndex: 2,
};

const innKeeperDistance = {
  zoom: 0.26,
  panX: -2.1,
  panY: -0.5,
  zIndex: 2,
};

const butterFly = async (scenery: AnimationControls) => {
  const flySpeed = 0.0025;
  const zoomSpeed = 0.025;
  const REST_TOADSTOOL = {
    x: 0.72,
    y: 0.87,
    z: 0.8,
  };

  const REST_STUMP = {
    x: 0.51,
    y: 0.29,
    z: 0.95,
  };

  const current = {
    ...REST_TOADSTOOL,
  };

  scenery.setControlValue("ButterflyX", current.x);
  scenery.setControlValue("ButterflyY", current.y);
  scenery.setControlValue("ButterflyZoom", current.z);

  scenery.startTrack("ButterflyWings", { speed: 0.2 });
  await delayFrames("bfParked", 320);
  let isFlying = false;

  const flyTo = (x: number, y: number, z: number) => {
    if (!isFlying) {
      scenery.startTrack("ButterflyWings");
      isFlying = true;
    }
    if (x < current.x) {
      scenery.setControlValue("ButterflyTurn", 0);
    } else {
      scenery.setControlValue("ButterflyTurn", 1);
    }
    return Promise.all([
      animationTween("ButterflyX", current.x, x, flySpeed, (value) => {
        current.x = value;
        scenery.setControlValue("ButterflyX", value);
      }),
      animationTween("ButterflyY", current.y, y, flySpeed, (value) => {
        current.y = value;
        scenery.setControlValue("ButterflyY", value);
      }),
      animationTween("ButterflyZoom", current.z, z, zoomSpeed, (value) => {
        current.z = value;
        scenery.setControlValue("ButterflyZoom", value);
      }),
    ]);
  };

  const flyToRandom = () => {
    const distance = Math.random() * 0.3;
    let xPos = Math.random() > 0.5 ? 1 : -1;
    let yPos = Math.random() > 0.5 ? 1 : -1;
    if (current.x + xPos * distance > 1 || current.x + xPos * distance < 0) {
      xPos *= -1;
    }
    if (current.y + yPos * distance > 1 || current.y + yPos * distance < 0) {
      yPos *= -1;
    }

    const x = current.x + xPos * distance;
    const y = current.y + yPos * distance;
    const z = Math.min(Math.max(current.z + Math.random() * distance, 0), 1);
    return flyTo(x, y, z);
  };

  while (true) {
    const destination = Math.random();
    if (destination > 0.95) {
      await flyTo(REST_TOADSTOOL.x, REST_TOADSTOOL.y, REST_TOADSTOOL.z);
      if (isFlying) {
        scenery.startTrack("ButterflyWings", { speed: 0.2 });
        isFlying = false;
      }
      await delayFrames("bfParked", 320);
    } else if (destination < 0.05) {
      await flyTo(REST_STUMP.x, REST_STUMP.y, REST_STUMP.z);
      if (isFlying) {
        scenery.startTrack("ButterflyWings", { speed: 0.2 });
        isFlying = false;
      }
      await delayFrames("bfParked", 320);
    } else {
      await flyToRandom();
    }
  }
};

const END = "END";

type DialogTree = (string | DialogChoice)[];
type DialogChoice = Record<string, DialogTree>;

const dialogTree: DialogTree = [
  "Hi! Welcome adventurer, welcome to my inn!",
  "Feel free to explore our world!",
  "During dialog my eyes will move to where you click in the image",
  "Nice meeting you, adventurer! Bye!",
  END,
];

const playDialog = async (
  dialogText: DialogTree,
  talkFn: (text: string) => Promise<void>
): Promise<void> => {
  for (const item of dialogText) {
    if (typeof item === "string" && item !== END) {
      await talkFn(item);
    }
  }
};

const Demo: React.VFC = () => {
  const animationRef = useRef<AnimationControls>();
  const characterRef = useRef<AnimationControls>();
  const [dialogText, setDialogText] = useState<string | null>(null);

  const dialogDoneRef = useRef(() => {});

  const onClick = useCallback(() => {
    dialogDoneRef.current();
  }, []);

  const getInnkeeperControls = useCallback(
    (animationControl: AnimationControls) => {
      characterRef.current = animationControl;
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
      butterFly(animationControl);

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

  const [interacting, setInteracting] = useState(false);

  const areas = useMemo<ComponentProps<typeof ClickableAreas>["areas"]>(
    () =>
      interacting
        ? []
        : [
            {
              id: "innkeeper",
              left: 0.19,
              right: 0.263,
              top: 0.508,
              bottom: 0.78,
              onClick: async () => {
                setInteracting(true);
                characterRef.current.setZoom(innKeeperClose.zoom);
                characterRef.current.setPanning(
                  innKeeperClose.panX,
                  innKeeperClose.panY
                );
                await delayFrames("startTalking", 60);
                characterRef.current.startTrack("PauseSweeping");

                const say = async (text: string) => {
                  characterRef.current.startTrack("Talking", { startAt: 800 });
                  characterRef.current.startTrack("Eyebrows");
                  await new Promise<void>((resolve) => {
                    dialogDoneRef.current = resolve;
                    setDialogText(text);
                  });
                  setDialogText(null);
                  characterRef.current.startTrack("StopTalking");
                  characterRef.current.startTrack("EyebrowReset");
                };

                await playDialog(dialogTree, say);

                characterRef.current.setZoom(innKeeperDistance.zoom);
                characterRef.current.setPanning(
                  innKeeperDistance.panX,
                  innKeeperDistance.panY
                );
                setInteracting(false);
                characterRef.current.startTrack("Sweeping");
              },
              cursor: "pointer",
            },
          ],
    [interacting]
  );

  const onRender = useCallback(() => {
    tick();
  }, []);

  return (
    <ClickableAreas areas={areas} width={2048}>
      <Player width={2048} height={1024} onRender={onRender}>
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
          options={innKeeperDistance}
        />
      </Player>
      <Dialog text={dialogText} title={"Innkeeper"} onClick={onClick} />
    </ClickableAreas>
  );
};

export default Demo;
