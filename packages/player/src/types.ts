// Import types from @geppetto/types v2.x for internal use
import type {
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
  FrameControlAction,
  FrameLayerVisibilityAction,
  FrameEvent,
  ControlDefinition,
  EasingFunction,
  Hierarchy,
  TreeNode,
  RootNode,
} from "@geppetto/types";

// Export for external use
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
  FrameControlAction,
  FrameLayerVisibilityAction,
  FrameEvent,
  ControlDefinition,
  EasingFunction,
  Hierarchy,
  TreeNode,
  RootNode,
};

export type PlayStatus = Record<
  string,
  {
    playing: boolean;
    startAt: number;
    startedAt: number;
  }
>;

// Prepared buffer types for WebGL
export type PreparedFloatBuffer = {
  data: Float32Array;
  length: number;
  stride: number;
};

export type PreparedIntBuffer = {
  data: Int32Array;
  length: number;
  stride: number;
};

export enum MixMode {
  MULTIPLY,
  ADD,
  HUE,
}

export type DirectControl = {
  mutation: number;
  control: number;
  stepType: number;
  mixMode: MixMode;
  trackX: Float32Array;
  trackY: Float32Array;
};

export type PreparedControl = {
  name: string;
  steps: number;
};

export type PreparedLayer = {
  name: string;
  start: number;
  amount: number;
  mutator: number;
  x: number;
  y: number;
  z: number;
  visible: boolean;
};

export type PreparedAnimation = {
  name: string;
  duration: number;
  looping: boolean;
  tracks: [number, Float32Array][];
  visibilityTracks: Map<number, [number, boolean][]>;
  events: [number, string][];
};

export type CanvasMetadata = {
  width: number;
  height: number;
  zoom: number;
  pan: Vec2;
};

/**
 * Optimized structure for WebGL rendering
 */
export type PreparedImageDefinition = {
  // Direct single-control mutations for fast GPU-free updates
  directControls: DirectControl[];
  
  // Mutation data as TypedArrays for WebGL
  mutators: PreparedFloatBuffer;
  mutatorParents: PreparedIntBuffer;
  mutationValues: PreparedFloatBuffer;
  
  // Complex multi-control mutation data
  controlMutationValues: PreparedFloatBuffer;
  mutationValueIndices: PreparedFloatBuffer;
  controlMutationIndices: PreparedFloatBuffer;
  
  // Geometry data
  shapeVertices: PreparedFloatBuffer;
  shapeIndices: Uint16Array;
  
  // Layer/shape list (sorted by z-index)
  layers: PreparedLayer[];
  
  // Visibility state (1 byte per layer)
  visibilityState: Uint8Array;
  
  // Control data
  controls: PreparedControl[];
  defaultControlValues: Float32Array;
  
  // Name lookup maps for string-based API
  controlNames: Map<string, number>;
  animationNames: Map<string, number>;
  layerNames: Map<string, number>;
  
  // Animation data
  animations: PreparedAnimation[];
  
  // Canvas metadata
  metadata: CanvasMetadata;
};
