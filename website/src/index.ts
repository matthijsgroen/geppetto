import { setupWebGL, prepareAnimation } from "geppetto-player";
import backgroundImage from "url:./assets/landscape.png";
import backgroundAnimationData from "./assets/landscape.json";
import characterImage from "url:./assets/lady.png";
import characterAnimationData from "./assets/lady.json";
import { version } from "../package.json";

const canvas = document.getElementById("theatre") as HTMLCanvasElement;
const player = setupWebGL(canvas);

const BASE_URL = `https://github.com/matthijsgroen/geppetto/releases/download/${version}`;
const BUILDS = [
  { platform: "mac", arch: "x64", filename: `Geppetto-${version}-mac.zip` },
  {
    platform: "mac",
    arch: "arm64",
    filename: `Geppetto-${version}-arm64-mac.zip`,
  },
  {
    platform: "win",
    filename: `Geppetto Setup ${version}.exe`,
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
  const bgTexture = await loadTexture(backgroundImage);
  const preppedBgAnim = prepareAnimation(backgroundAnimationData);
  const bgAnimationControl = player.addAnimation(preppedBgAnim, bgTexture, 0, {
    zoom: 2.0,
  });

  const charTexture = await loadTexture(characterImage);
  const preppedCharAnim = prepareAnimation(characterAnimationData);
  const charAnimationControls = player.addAnimation(
    preppedCharAnim,
    charTexture,
    1,
    {
      zoom: 2.4,
      panX: -0.25,
      panY: 0.1,
      zIndex: 2,
    }
  );

  console.log(
    "Controls",
    preppedCharAnim.controls.map((e) => e.name)
  );

  console.log(
    "Animations",
    preppedCharAnim.animations.map((e) => e.name)
  );

  charAnimationControls.onEvent((event, track, time) => {
    console.log("EVENT:", event, track, time);
  });

  const box = canvas.getBoundingClientRect();
  canvas.width = box.width * window.devicePixelRatio;
  canvas.height = box.height * window.devicePixelRatio;

  bgAnimationControl.startTrack("Waterrad");
  bgAnimationControl.startTrack("Waterrad2");
  bgAnimationControl.startTrack("Rook");

  charAnimationControls.startTrack("Eye blink");
  charAnimationControls.startTrack("Talking");
  charAnimationControls.startTrack("HeadTilt");

  const [smokeButton, wheelButton, winkButton] = document.querySelectorAll(
    "button"
  );

  let smokePlaying = true;
  let wheelPlaying = true;
  wheelButton.addEventListener("click", () => {
    wheelPlaying = !wheelPlaying;
    wheelButton.innerText = wheelPlaying ? "Stop wheel" : "Start wheel";
    if (wheelPlaying) {
      bgAnimationControl.startTrack("Waterrad");
      bgAnimationControl.startTrack("Waterrad2");
    } else {
      bgAnimationControl.stopTrack("Waterrad");
      bgAnimationControl.stopTrack("Waterrad2");
    }
  });

  smokeButton.addEventListener("click", () => {
    smokePlaying = !smokePlaying;
    smokeButton.innerText = smokePlaying ? "Stop smoke" : "Start smoke";
    if (smokePlaying) {
      bgAnimationControl.startTrack("Rook");
    } else {
      bgAnimationControl.stopTrack("Rook");
    }
  });

  charAnimationControls.onTrackStopped((track) => {
    console.log(`Track ${track} has stopped`);
    if (track === "Eye wink") {
      charAnimationControls.startTrack("Eye blink");
    }
  });

  winkButton.addEventListener("click", () => {
    console.log("Start Eye wink");
    charAnimationControls.startTrack("EyeWink");
  });

  let lookTarget = [0, 0];
  let currentLooking = [0, 0];
  const eyesCentered = [0.145, 0.385];

  canvas.addEventListener("click", (event) => {
    const box = canvas.getBoundingClientRect();
    const position = [event.x / box.width, event.y / box.height];
    lookTarget = [
      Math.min(1, Math.max(-1, (position[0] - eyesCentered[0]) / 0.4)),
      Math.min(1, Math.max(-1, (position[1] - eyesCentered[1]) / 0.4)),
    ];
  });

  const speed = 0.025;

  const renderFrame = () => {
    if (currentLooking[0] !== lookTarget[0]) {
      if (currentLooking[0] < lookTarget[0]) {
        currentLooking[0] += Math.min(speed, lookTarget[0] - currentLooking[0]);
      } else {
        currentLooking[0] -= Math.min(speed, currentLooking[0] - lookTarget[0]);
      }
    }
    if (currentLooking[1] !== lookTarget[1]) {
      if (currentLooking[1] < lookTarget[1]) {
        currentLooking[1] += Math.min(speed, lookTarget[1] - currentLooking[1]);
      } else {
        currentLooking[1] -= Math.min(speed, currentLooking[1] - lookTarget[1]);
      }
    }

    charAnimationControls.setControlValue(
      "RightEye-x",
      currentLooking[0] + 1.0
    );
    charAnimationControls.setControlValue("LeftEye-x", currentLooking[0] + 1.0);

    charAnimationControls.setControlValue(
      "HeadTurn",
      1.0 - (currentLooking[0] + 1.0) * 0.5
    );
    charAnimationControls.setControlValue(
      "RightEye-y",
      (currentLooking[1] + 1.0) * 0.5
    );
    charAnimationControls.setControlValue(
      "LeftEye-y",
      (currentLooking[1] + 1.0) * 0.5
    );

    player.render();
    bgAnimationControl.render();
    charAnimationControls.render();
    window.requestAnimationFrame(renderFrame);
  };

  window.requestAnimationFrame(renderFrame);
};

start();
populateDownloadLinks();
