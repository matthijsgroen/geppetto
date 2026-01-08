export { prepareAnimation } from "./prepareAnimation";
export { createPlayer, setupWebGL } from "./player";
export type {
  GeppettoPlayer,
  AnimationControls,
  AnimationOptions,
  PlayOptions,
  Unsubscribe,
  TrackStoppedCallback,
  CustomEventCallback,
} from "./player";

// Re-export format 2 types
export * from "@geppetto/types";
