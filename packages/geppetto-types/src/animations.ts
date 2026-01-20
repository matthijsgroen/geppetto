/**
 * Easing function types for animation interpolation
 */
export type EasingFunction = "easeIn" | "easeOut" | "easeInOut" | "linear";

/**
 * Control action that animates a control value
 */
export type FrameControlAction = {
  start: number;
  easingFunction: EasingFunction;
  controlEndValue: number;
  controlStartValue?: number;
  duration: number;
};

/**
 * Layer visibility action
 */
export type FrameLayerVisibilityAction = {
  start: number;
  visible: boolean;
};

/**
 * Custom event triggered at a specific time
 */
export type FrameEvent = {
  start: number;
  eventName: string;
};

/**
 * Any frame action type
 */
export type FrameAction =
  | FrameControlAction
  | FrameLayerVisibilityAction
  | FrameEvent;

/**
 * Animation track for controlling a control
 */
export type AnimationControlTrack = {
  type: "control";
  controlId: string;
  actions: FrameControlAction[];
  length: number;
};

/**
 * Animation track for layer visibility
 */
export type AnimationVisibilityTrack = {
  type: "visibility";
  layerId: string;
  actions: FrameLayerVisibilityAction[];
  length: number;
};

/**
 * Any animation track type
 */
export type AnimationTrack = AnimationControlTrack | AnimationVisibilityTrack;

/**
 * An animation with tracks and events
 */
export type Animation = {
  name: string;
  looping: boolean;
  speedModifier?: number
  tracks: AnimationTrack[];
  events: FrameEvent[];
};
