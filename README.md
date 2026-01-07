# Geppetto player 🌱

[![npm type definitions](https://img.shields.io/npm/types/geppetto-player)](https://matthijsgroen.github.io/geppetto-player)
[![License](https://img.shields.io/npm/l/geppetto-player)](https://github.com/matthijsgroen/geppetto-player/blob/main/LICENSE)
[![Version](https://img.shields.io/npm/v/geppetto-player)](https://www.npmjs.com/package/geppetto-player)

[API documentation](https://matthijsgroen.github.io/geppetto-player)

Library for playing Geppetto animations. For the Desktop application to create the animations, see [the Geppetto website](https://geppetto.js.org)

# Features

- Setup of webGL Canvas for playing Geppetto files
- Loading and rendering of Geppetto files
- Listening to events from animation tracks
- Using controls from images
- Starting/stopping looping of animation tracks

# Install

```
yarn add geppetto-player
```

## Minimal setup

This example is based on a build using Parcel2. For Webpack, change the way the url of the texture asset is referenced.

```typescript
import { setupWebGL, prepareAnimation } from "geppetto-player";
import backgroundImage from "url:./assets/landscape.png";
import backgroundAnimationData from "./assets/landscape.json";

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

  const box = canvas.getBoundingClientRect();
  canvas.width = box.width * window.devicePixelRatio;
  canvas.height = box.height * window.devicePixelRatio;

  // Start some animation tracks
  bgAnimationControl.startTrack("Waterwheel");
  bgAnimationControl.startTrack("Waterwheel2");
  bgAnimationControl.startTrack("Smoke");

  // Render each frame
  const renderFrame = () => {
    player.render(); // Clears the canvas
    bgAnimationControl.render(); // Render active frame of the animation
    window.requestAnimationFrame(renderFrame);
  };

  window.requestAnimationFrame(renderFrame);
};

start();
```

## Why do I need to setup this render loop myself?

It is to give you more control. You can specify the resolution to render,
or render multiple Geppetto animations in the same WebGL Canvas. You could even create framebuffers, render into them and apply a shader aftereffect on it if you desire. (all these things I consider outside of the scope of this player library :-))

## Using the library in a babel built site (Webpack, CRA)

Check out: https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining

# License

[MIT](./LICENSE) (c) [Matthijs Groen](https://twitter.com/matthijsgroen)
