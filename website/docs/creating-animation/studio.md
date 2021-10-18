---
sidebar_position: 2
---

# Geppetto Studio

- Add download buttons

## Installation

You can download the latest version of the app from https://github.com/matthijsgroen/geppetto/releases

The apps are untrusted at the moment, if you don't trust it, you can either checkout the electron code at https://github.com/matthijsgroen/geppetto/tree/main/public/electron to review yourself if you trust what I'm doing.

To open an untrusted app:

## On Mac

https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac

## On Windows

...

## Screens

Here you can find how each screen works, what its purpose is and even
tutorials how to create cool 2d animated characters!

Geppetto is meant to be an application to create WebGL Animations. The process
of creating an animation has the following steps:

1. Create a texture (outside of Geppetto)
2. [Create layers from the texture](./Layers)
3. [Stack/place the layers](./Composition#moving-layers)
4. [Add mutations to the layers](./Composition#adding-mutations)
5. [Create controls on the mutations](./Composition#adding-controls)
6. [Create animation tracks from the controls](./Animation)

The contents of step 1 is your texture (most of the time: a `.png` file) The
contents of the other steps will be stored in a `.json` file.
