# Copilot & AI Agent Instructions for Geppetto

## Project Overview
- **Geppetto** is a modular animation platform for creating and embedding WebGL animations. It consists of:
  - **Studio**: Web app for authoring animations ([packages/studio](../packages/studio))
  - **Player**: JS library for playing animations ([packages/player](../packages/player))
  - **Types**: TypeScript types/validators for the animation format ([packages/geppetto-types](../packages/geppetto-types))
  - **Website**: Docs and landing page ([packages/website](../packages/website))

## Architecture & Patterns
- **Monorepo** managed with Yarn workspaces. Each package is self-contained but shares types and build tooling.
- **Studio** is structured in layers:
  - `ui/components/`: Visual React components (see Storybook)
  - `application/`: State management and UI composition
  - `animation/`: Business logic for animation data transforms
- **Player** exposes a WebGL-based API for loading, rendering, and controlling animations. See [README](../packages/player/README.md) for usage patterns.
- **Types** package provides type guards and validators for animation files. Use `isFormat2File()` to validate data.

## Developer Workflows
- **Build all**: `yarn build`
- **Studio dev**: `yarn studio-dev` (runs the authoring app)
- **Test all**: `yarn test`
- **Player build**: `yarn build-player`
- **Website dev**: `yarn start` in `packages/website`
- **Storybook**: See [Storybook](https://geppetto.js.org/storybook/) for UI components

## Conventions & Integration
- **Animation files**: JSON format, validated by `@geppetto/types`
- **Textures**: PNG images, referenced in animation JSON
- **Cross-package imports**: Use workspace aliases (e.g., `@geppetto/types`)
- **Testing**: Uses [Vitest](https://vitest.dev/) in each package
- **Build tools**: Vite for Studio/Player, Docusaurus for Website
- **PWA**: Studio is being migrated to a Progressive Web App (see `next` branch)

## Key Files & References
- [packages/studio/src/README.md](../packages/studio/src/README.md): Studio architecture
- [packages/player/README.md](../packages/player/README.md): Player usage and integration
- [packages/geppetto-types/README.md](../packages/geppetto-types/README.md): Animation format types
- [Root README.md](../README.md): Project overview and scripts

## Example: Loading an Animation in Player
```typescript
import { setupWebGL, prepareAnimation } from "geppetto-player";
const player = setupWebGL(canvas);
const preppedAnim = prepareAnimation(animationData);
player.addAnimation(preppedAnim, texture, 0, { zoom: 2.0 });
```

---
For more, see the READMEs in each package and the [Geppetto website](https://geppetto.js.org/).
