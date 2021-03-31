import { setupWebGL, prepareAnimation } from "geppetto-player";
import backgroundImage from "url:./assets/landscape.png";
import backgroundAnimationData from "./assets/landscape.json";
import characterImage from "url:./assets/body-texture.png";
import characterAnimationData from "./assets/Body.json";

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
      panX: -0.3,
      panY: 0.1,
      zIndex: 2,
    }
  );

  const box = canvas.getBoundingClientRect();
  canvas.width = box.width * window.devicePixelRatio;
  canvas.height = box.height * window.devicePixelRatio;

  bgAnimationControl.startTrack("Waterrad");
  bgAnimationControl.startTrack("Waterrad2");
  bgAnimationControl.startTrack("Rook");

  charAnimationControls.startTrack("Eye blink");
  charAnimationControls.startTrack("Talking");

  const [smokeButton, wheelButton] = document.querySelectorAll("button");

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

  const renderFrame = () => {
    player.render();
    bgAnimationControl.render();
    charAnimationControls.render();
    window.requestAnimationFrame(renderFrame);
  };

  window.requestAnimationFrame(renderFrame);
};

start();
