import { setupWebGL, prepareAnimation, ImageDefinition } from "geppetto-player";
import backgroundImage from "url:./assets/scenery.png";
import backgroundAnimationData from "./assets/scenery.json";
// import characterImage from "url:./assets/lady.png"; import characterAnimationData from "./assets/lady.json";
import { version } from "../package.json";

const canvas = document.getElementById("theatre") as HTMLCanvasElement;
const player = setupWebGL(canvas);

const BASE_URL = `https://github.com/matthijsgroen/geppetto/releases/download/${version}`;
const BUILDS = [
  { platform: "mac", arch: "x64", filename: `Geppetto-${version}-mac.dmg` },
  {
    platform: "mac",
    arch: "arm64",
    filename: `Geppetto-${version}-arm64-mac.dmg`,
  },
  {
    platform: "win",
    filename: `Geppetto.Setup.${version}.exe`,
  },
  {
    platform: "linux",
    arch: "amd64",
    filename: `geppetto_${version}_amd64.deb`,
  },
  {
    platform: "linux",
    arch: "arm64",
    filename: `geppetto_${version}_arm64.deb`,
  },
];

const populateDownloadLinks = () => {
  const title = document.getElementById("version") as HTMLHeadingElement;
  title.innerText = `Version ${version}`;

  BUILDS.forEach((build) => {
    const downloadList = document.getElementById(
      `download-${build.platform}`
    ) as HTMLParagraphElement;
    const link = document.createElement("a");
    link.setAttribute("href", `${BASE_URL}/${build.filename}`);
    link.innerText = `Download ${build.arch || build.platform} version`;
    const listItem = document.createElement("li");
    listItem.appendChild(link);
    downloadList.appendChild(listItem);
  });
};

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

    // const charTexture = await loadTexture(characterImage);
    // const preppedCharAnim = prepareAnimation(
    //   (characterAnimationData as unknown) as ImageDefinition
    // );
    // const charAnimationControls = player.addAnimation(
    //   preppedCharAnim,
    //   charTexture,
    //   1,
    //   {
    //     zoom: 2.4,
    //     panX: -0.3,
    //     panY: 0.1,
    //     zIndex: 2,
    //   }
    // );

    const box = canvas.getBoundingClientRect();
    canvas.width = box.width * window.devicePixelRatio;
    canvas.height = box.height * window.devicePixelRatio;

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

    // charAnimationControls.startTrack("Eye blink");
    // charAnimationControls.startTrack("Talking");
    // charAnimationControls.startTrack("Eyebrows");
    // charAnimationControls.startTrack("HeadTilt");

    let tweens: { name: string; ticker: () => void }[] = [];

    type TweenCreator = (
      name: string,
      source: number,
      target: number,
      speed: number,
      applier: (value: number) => void
    ) => Promise<void>;

    const cleanTicker = (name: string) => {
      tweens = tweens.filter((e) => e.name !== name);
    };

    const animationTween: TweenCreator = (
      name,
      source,
      target,
      speed,
      applier
    ) =>
      new Promise((resolve) => {
        cleanTicker(name);
        let current = source;
        const ticker = () => {
          if (current === target) {
            cleanTicker(name);
            resolve();
          } else {
            if (current < target) {
              current += Math.min(speed, target - current);
            } else {
              current -= Math.min(speed, current - target);
            }
          }
          applier(current);
        };
        tweens = tweens.concat({ name, ticker });
      });

    const delayFrames = (name: string, frames: number): Promise<void> =>
      new Promise((resolve) => {
        cleanTicker(name);
        let current = frames;

        const ticker = () => {
          if (current === 0) {
            cleanTicker(name);
            resolve();
          } else {
            current--;
          }
        };
        tweens = tweens.concat({ name, ticker });
      });

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

    /*
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
    */

    // girlEyes();
    butterFly();

    const renderFrame = () => {
      for (const tween of tweens) {
        tween.ticker();
      }

      player.render();
      bgAnimationControl.render();
      // charAnimationControls.render();
      window.requestAnimationFrame(renderFrame);
    };

    window.requestAnimationFrame(renderFrame);
  } catch (e) {
    document.write("Error", e.message);
  }
};

populateDownloadLinks();
start();
