# Geppetto

![Geppetto logo](./public/logo192.png)

Geppetto is a free and open animation tool to create and embed webGL animations in a web site. This is the repository for the browser app to create the animations.

- [Geppetto website](https://geppetto.js.org/)
- [Geppetto JavaScript Player library](https://github.com/matthijsgroen/geppetto-player)
- [Discussions](https://github.com/matthijsgroen/geppetto/discussions)

## Geppetto - NEXT

This is the branch for the Geppetto Studio 'next' where the studio application will be turned into a PWA, saying goodbye to the electron app. For the electron app version, check the `main` branch.

## What is Geppetto?

Geppetto consists of two parts. A [web application](https://geppetto.js.org/app) to define animated images, and a [JavaScript library](https://github.com/matthijsgroen/geppetto-player) to play them.

## How does it work?

You need to create a texture file as .PNG. in Geppetto you will make layers from your texture, and compose them into your image. Next step is to add mutations to your layer tree to create motion. You can then create timelines to define multiple animations.

These animations (the created .json file and your texture .png) can then be loaded using [the geppetto player](https://github.com/matthijsgroen/geppetto-player) and embedded in a website or electron app.

![Screenshot: Animation screen](./screenshots/animation2.png)

## Available Scripts

Yarn scripts to get started with this repo:

- `yarn start` Starts the web app in develoment mode
- `yarn test` Running tests
- `yarn build` Create production builds

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Special thanks

- Guido Theelen, for creating the Geppetto logo

# License

[MIT](./LICENSE) (c) [Matthijs Groen](https://twitter.com/matthijsgroen)
