---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using the player

## Install Player

You can install the project using the `geppetto-player` package.

<Tabs groupId="package-manager">
<TabItem value="yarn" label="Yarn">

```sh
yarn add geppetto-player
```

</TabItem>
<TabItem value="npm" label="Npm">

```sh
npm install geppetto-player
```

</TabItem>
</Tabs>

## Setup WebGL

First you need to setup a canvas environment.
You can use the `setupWebGL` method to help you with that.

<Tabs groupId="coding-language">
<TabItem value="ts" label="Typescript">

```ts
import { setupWebGL } from "geppetto-player";

const canvas = document.getElementById("theatre") as HTMLCanvasElement;
const player = setupWebGL(canvas);
```

</TabItem>
<TabItem value="js" label="JavaScript">

```js
import { setupWebGL } from "geppetto-player";

const canvas = document.getElementById("theatre");
const player = setupWebGL(canvas);
```

</TabItem>
</Tabs>

This will initialise the `WebGL` context of the `<canvas />` element, and return a player to setup Geppetto animations.

With the player you can now add animations to the player. You can setup and use multiple animations in a single player.

## Adding an animation

To add the animation, you need to convert the animation `.json` file created with the studio application to a format optimized for playback.

<Tabs groupId="coding-language">
<TabItem value="ts" label="Typescript">

```ts
import { prepareAnimation, ImageDefinition } from "geppetto-player";
import animationData from "my-animation-file.json";

const preparedAnimation = prepareAnimation(
  animationData as unknown as ImageDefinition
);
```

</TabItem>
<TabItem value="js" label="JavaScript">

```js
import { prepareAnimation, ImageDefinition } from "geppetto-player";
import animationData from "my-animation-file.json";

const preparedAnimation = prepareAnimation(animationData);
```

</TabItem>
</Tabs>

You also need to provide your texture using an `Image` element in javascript.

You can load your texture with the example code provided here:

<Tabs groupId="coding-language">
<TabItem value="ts" label="Typescript">

```ts
const loadTexture = async (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
  });

const animationTexture = await loadTexture("./url-of-texture.png");
```

</TabItem>
<TabItem value="js" label="JavaScript">

```js
const loadTexture = async (url) =>
  new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
  });

const animationTexture = await loadTexture("./url-of-texture.png");
```

</TabItem>
</Tabs>

You can now add your animation to the player, receiving an `AnimationControl` object to control your animation.

```ts
const animationControl = player.addAnimation(
  preparedAnimation,
  animationTexture,
  0
);
```

## Setting up a render loop

In order to make the animation work, you should create a render loop that renders the animation for each frame.

The reason we let you setup this loop, is that you will have more control over it.

For the animation above, this loop would be simple:

```ts
const renderFrame = () => {
  player.render(); // Clear the canvas
  animationControl.render(); // Render a frame of my first animation
  // ... for multiple animations, do a render() call for each animationControl

  window.requestAnimationFrame(renderFrame);
};

window.requestAnimationFrame(renderFrame);
```

## Controlling an animation

With the animation now visible, you can start animation tracks, listen to events, or do real-time control manipulations.

```ts
animationControl.startTrack("MyAnimation");
animationControl.setControlValue("MyControl", 0.65);
```
