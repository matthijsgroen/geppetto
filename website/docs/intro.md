---
sidebar_position: 1
---

# Getting started

Hey! Welcome to Geppetto! With Geppetto you can create 2D animations from your image using the Geppetto Studio, and embed those animations in any website using Geppetto Player.

## Features

- 🎬 **Capable of animations & runtime controls**

  Define animations and play them a single time or in a loop. Control the playback speed. Use controls to tweak images in real-time. Check out the [playground](./playground.mdx) to see what we mean.

- 🐣 **Small in size**

  Size: Less than **10 kB** with all dependencies, minified and gzipped

- ⚖️ **Open source**

  The entire project (Studio / Player) is [MIT licensed](https://github.com/matthijsgroen/geppetto/blob/main/LICENSE). You can see all the internals, and improve upon them 🙂.

- 🍻 **Free to use & distribute**

  You can download, use in any kind of project without explicit permission. Just use and enjoy!

- 🌱 **Energy efficient**

  Maybe this library is not super feature rich, but that is also because I want to focus on efficient rendering. I want to be able to make an adventure game you could play on your phone for hours, not 20 minutes before the battery is drained.

- 🕸 **Made for the web**

  Only JavaScript/TypeScript code here. Feel free to support the JSON format for players in other languages though 😇

## How does Geppetto work?

Geppetto uses your 2D texture (image) to render pieces of the image on a 2D vector area. This area is build up from triangles, that you can specify yourself in the Geppetto Studio App.

These 2D areas can then be manipulated in size and form, causing the image to stretch as well, causing motion and animation.
