import { createPlayer, prepareAnimation } from "geppetto-player";
import image from "url:./assets/landscape.png";
import animation from "./assets/landscape.json";

const canvas = document.getElementById("theatre") as HTMLCanvasElement;

const player = createPlayer(canvas);

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
  const backgroundAnimation = player.addAnimation(preparedAnimation, img);

  backgroundAnimation.render();
};

start();
