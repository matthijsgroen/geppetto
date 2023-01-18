# Geppetto Source Code

The codebase is split in multiple layers:

- The UI layer, containing all visual components that composes the UI: `ui-components/` 
  These are also visible in [Storybook](https://geppetto.js.org/storybook/)
- The Application layer, managing state, composing the UI and calling the business logic: `application/`
- The Business Logic layer, doing the data transforms for the animations: `animation/`
