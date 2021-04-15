# Geppetto

![Geppetto logo](./public/logo192.png)

Geppetto is a free and open animation tool to embed webGL animations in a web site. This is the repository for the desktop app.
Made with [Create React App](https://github.com/facebook/create-react-app) and [Electron](https://electronjs.org/).

- [Geppetto demo](https://geppetto.js.org/)
- [Geppetto JavaScript Player library](https://github.com/matthijsgroen/geppetto-player)
- [Documentation](https://github.com/matthijsgroen/geppetto/wiki)
- [Discussions](https://github.com/matthijsgroen/geppetto/discussions)

## What is Geppetto?

Geppetto consists of two parts. A [desktop application](https://github.com/matthijsgroen/geppetto/releases/latest) to define animated images, and a [JavaScript library](https://github.com/matthijsgroen/geppetto-player) to play them.

## How does it work?

You need to create a texture file as .PNG. in Geppetto you will make layers from your texture, and compose them into your image. Next step is to add mutations to your layer tree to create motion. You can then create timelines to define multiple animations.

These animations (the created .json file and your texture .png) can then be loaded using [the geppetto player](https://github.com/matthijsgroen/geppetto-player) and embedded in a website or electron app.

## Available Scripts

Yarn scripts to get started with this repo:

- `yarn electron-dev` Starts electron in develoment mode
- `yarn test` Running tests
- `yarn electron-pack` Create production builds

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn Electron, check out the [Electron documentation](https://electronjs.org/).

## Special thanks

- Guido Theelen, for creating the Geppetto logo

# License

[MIT](./LICENSE) (c) [Matthijs Groen](https://twitter.com/matthijsgroen)
