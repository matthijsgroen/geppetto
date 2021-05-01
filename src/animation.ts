import { setupWebGL, prepareAnimation, ImageDefinition } from "geppetto-player";
import backgroundImage from "url:./assets/scenery.png";
import backgroundAnimationData from "./assets/scenery.json";
import characterImage from "url:./assets/innkeeper.png";
import characterAnimationData from "./assets/innkeeper.json";
import { animationTween, cleanTicker, delayFrames, tick } from "./tween";
import { conversation } from "./conversation";

const canvas = document.getElementById("theatre") as HTMLCanvasElement;
const player = setupWebGL(canvas);

const loadTexture = async (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
  });

const start = async () => {
  try {
    const bgTexture = await loadTexture(backgroundImage);
    const preppedBgAnim = prepareAnimation(
      (backgroundAnimationData as unknown) as ImageDefinition
    );
    const bgAnimationControl = player.addAnimation(
      preppedBgAnim,
      bgTexture,
      0,
      {
        zoom: 2.0,
        panX: 0,
      }
    );

    const charTexture = await loadTexture(characterImage);
    const preppedCharAnim = prepareAnimation(
      (characterAnimationData as unknown) as ImageDefinition
    );
    const innKeeperDistance = {
      zoom: 0.26,
      panX: -2.1,
      panY: -0.5,
      zIndex: 2,
    };
    const innKeeperClose = {
      zoom: 2.2,
      panX: -0.3,
      panY: 0.1,
      zIndex: 2,
    };
    const charAnimationControls = player.addAnimation(
      preppedCharAnim,
      charTexture,
      1,
      innKeeperDistance
    );

    const setCanvasSize = () => {
      const box = canvas.getBoundingClientRect();
      const override = navigator.userAgent.includes("SMART-TV") ? 2 : 1;
      canvas.width = Math.min(
        2048,
        box.width * window.devicePixelRatio * override
      );
      canvas.height = Math.min(
        1024,
        box.height * window.devicePixelRatio * override
      );
    };
    setCanvasSize();

    window.addEventListener("resize", () => {
      setCanvasSize();
    });

    bgAnimationControl.startTrack("Wheel");
    bgAnimationControl.startTrack("WheelBlades");
    bgAnimationControl.startTrack("Tree");
    bgAnimationControl.startTrack("Bird");
    bgAnimationControl.startTrack("Cloud1", { speed: 0.15 });
    bgAnimationControl.startTrack("Cloud2", { speed: 0.1 });
    bgAnimationControl.startTrack("Cloud3", { speed: 0.15 });
    bgAnimationControl.startTrack("Eyes");
    bgAnimationControl.startTrack("Smoke");
    bgAnimationControl.startTrack("Water");

    let inkeeperInDistance = true;

    charAnimationControls.startTrack("Eye blink");
    charAnimationControls.startTrack("HeadTilt");

    const butterFly = async () => {
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

      bgAnimationControl.setControlValue("ButterflyX", current.x);
      bgAnimationControl.setControlValue("ButterflyY", current.y);
      bgAnimationControl.setControlValue("ButterflyZoom", current.z);

      bgAnimationControl.startTrack("ButterflyWings", { speed: 0.2 });
      await delayFrames("bfParked", 320);
      let isFlying = false;

      const flyTo = (x: number, y: number, z: number) => {
        if (!isFlying) {
          bgAnimationControl.startTrack("ButterflyWings");
          isFlying = true;
        }
        if (x < current.x) {
          bgAnimationControl.setControlValue("ButterflyTurn", 0);
        } else {
          bgAnimationControl.setControlValue("ButterflyTurn", 1);
        }
        return Promise.all([
          animationTween("ButterflyX", current.x, x, flySpeed, (value) => {
            current.x = value;
            bgAnimationControl.setControlValue("ButterflyX", value);
          }),
          animationTween("ButterflyY", current.y, y, flySpeed, (value) => {
            current.y = value;
            bgAnimationControl.setControlValue("ButterflyY", value);
          }),
          animationTween("ButterflyZoom", current.z, z, zoomSpeed, (value) => {
            current.z = value;
            bgAnimationControl.setControlValue("ButterflyZoom", value);
          }),
        ]);
      };

      const flyToRandom = () => {
        const distance = Math.random() * 0.3;
        let xPos = Math.random() > 0.5 ? 1 : -1;
        let yPos = Math.random() > 0.5 ? 1 : -1;
        if (
          current.x + xPos * distance > 1 ||
          current.x + xPos * distance < 0
        ) {
          xPos *= -1;
        }
        if (
          current.y + yPos * distance > 1 ||
          current.y + yPos * distance < 0
        ) {
          yPos *= -1;
        }

        const x = current.x + xPos * distance;
        const y = current.y + yPos * distance;
        const z = Math.min(
          Math.max(current.z + Math.random() * distance, 0),
          1
        );
        return flyTo(x, y, z);
      };

      while (true) {
        const destination = Math.random();
        if (destination > 0.95) {
          await flyTo(REST_TOADSTOOL.x, REST_TOADSTOOL.y, REST_TOADSTOOL.z);
          if (isFlying) {
            bgAnimationControl.startTrack("ButterflyWings", { speed: 0.2 });
            isFlying = false;
          }
          await delayFrames("bfParked", 320);
        } else if (destination < 0.05) {
          await flyTo(REST_STUMP.x, REST_STUMP.y, REST_STUMP.z);
          if (isFlying) {
            bgAnimationControl.startTrack("ButterflyWings", { speed: 0.2 });
            isFlying = false;
          }
          await delayFrames("bfParked", 320);
        } else {
          await flyToRandom();
        }
      }
    };

    const girlEyes = () => {
      let currentLooking = [0, 0];
      const eyesCentered = [0.145, 0.388];
      const LOOK_KEEP_POSITION = 180;
      const eyeSpeed = 0.025;

      const lookAt = (x: number, y: number): Promise<void> =>
        Promise.all([
          animationTween("eye-X", currentLooking[0], x, eyeSpeed, (value) => {
            currentLooking[0] = value;
            charAnimationControls.setControlValue("RightEye-x", value + 1.0);
            charAnimationControls.setControlValue("LeftEye-x", value + 1.0);
            charAnimationControls.setControlValue(
              "HeadTurn",
              1.0 - (value + 1.0) * 0.5
            );
          }),
          animationTween("eye-Y", currentLooking[1], y, eyeSpeed, (value) => {
            currentLooking[1] = value;
            charAnimationControls.setControlValue(
              "RightEye-y",
              (value + 1.0) * 0.5
            );
            charAnimationControls.setControlValue(
              "LeftEye-y",
              (value + 1.0) * 0.5
            );
          }),
        ]).then(() => {});

      canvas.addEventListener("click", async (event) => {
        const box = canvas.getBoundingClientRect();
        const position = [event.x / box.width, event.y / box.height];

        if (
          position[0] > 0.203 &&
          position[0] < 0.263 &&
          position[1] > 0.458 &&
          position[1] < 0.706 &&
          inkeeperInDistance
        ) {
          charAnimationControls.setZoom(innKeeperClose.zoom);
          charAnimationControls.setPanning(
            innKeeperClose.panX,
            innKeeperClose.panY
          );
          inkeeperInDistance = false;
          conversation(charAnimationControls).then(() => {
            charAnimationControls.setZoom(innKeeperDistance.zoom);
            charAnimationControls.setPanning(
              innKeeperDistance.panX,
              innKeeperDistance.panY
            );
            inkeeperInDistance = true;
          });
          return;
        }

        const x = Math.min(
          1,
          Math.max(-1, (position[0] - eyesCentered[0]) / 0.4)
        );
        const y = Math.min(
          1,
          Math.max(-1, (position[1] - eyesCentered[1]) / 0.4)
        );
        cleanTicker("resetDelay");
        await lookAt(x, y);
        await delayFrames("resetDelay", LOOK_KEEP_POSITION);
        await lookAt(0, -0.1);
      });

      lookAt(0, -0.1);
    };

    girlEyes();
    butterFly();

    const renderFrame = () => {
      tick();

      player.render();
      bgAnimationControl.render();
      charAnimationControls.render();
      window.requestAnimationFrame(renderFrame);
    };

    window.requestAnimationFrame(renderFrame);
  } catch (e) {
    writeError(e.message);
  }
};

start();
