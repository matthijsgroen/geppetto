import { setupWebGL, prepareAnimation } from "geppetto-player";
import image from "url:./assets/landscape.png";
import animation from "./assets/landscape.json";

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
  const img = await loadTexture(image);
  const preparedAnimation = prepareAnimation(animation);
  const backgroundAnimation = player.addAnimation(preparedAnimation, img, 0, {
    zoom: 2.0,
  });

  const box = canvas.getBoundingClientRect();
  canvas.width = box.width * window.devicePixelRatio;
  canvas.height = box.height * window.devicePixelRatio;

  backgroundAnimation.startTrack("Waterrad");
  backgroundAnimation.startTrack("Waterrad2");
  backgroundAnimation.startTrack("Rook");

  const [smokeButton, wheelButton] = document.querySelectorAll("button");

  let smokePlaying = true;
  let wheelPlaying = true;
  wheelButton.addEventListener("click", () => {
    wheelPlaying = !wheelPlaying;
    wheelButton.innerText = wheelPlaying ? "Stop wheel" : "Start wheel";
    if (wheelPlaying) {
      backgroundAnimation.startTrack("Waterrad");
      backgroundAnimation.startTrack("Waterrad2");
    } else {
      backgroundAnimation.stopTrack("Waterrad");
      backgroundAnimation.stopTrack("Waterrad2");
    }
  });

  smokeButton.addEventListener("click", () => {
    smokePlaying = !smokePlaying;
    smokeButton.innerText = smokePlaying ? "Stop smoke" : "Start smoke";
    if (smokePlaying) {
      backgroundAnimation.startTrack("Rook");
    } else {
      backgroundAnimation.stopTrack("Rook");
    }
  });

  const renderFrame = () => {
    player.render();
    backgroundAnimation.render();

    window.requestAnimationFrame(renderFrame);
  };

  window.requestAnimationFrame(renderFrame);
};

start();
