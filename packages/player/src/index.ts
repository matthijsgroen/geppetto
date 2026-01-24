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
export type {
  Vec2,
  Vec3,
  Vec4,
  MutationVector,
  Layer,
  GeppettoImage,
  Animation,
  AnimationTrack,
  AnimationControlTrack,
  AnimationVisibilityTrack,
  FrameLayerVisibilityAction,
  FrameEvent,
  ControlDefinition,
  EasingFunction,
  Hierarchy,
  TreeNode,
  RootNode,
  CanvasMetadata,
  PreparedImageDefinition,
  PreparedLayer,
  PreparedFloatBuffer,
  PreparedIntBuffer,
} from "./types";
