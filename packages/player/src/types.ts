// Re-export types from @geppetto/types
export type {
  Vec2,
  Vec3,
  Vec4,
  EasingFunction,
  CanvasMetadata,
  MutationVector,
  TranslationVector,
  DeformationVector as DeformVector,
  StretchVector,
  RotationVector,
  OpacityVector,
  Lightness as LightnessVector,
  Saturation as SaturationVector,
  Colorize as ColorTintVector,
  Colorize as HueVector, // Alias
  ControlDefinition,
  Keyframe as ControlStep,
  Hierarchy,
  TreeNode,
  RootNode,
  Layer,
  FrameControlAction as PreparedControlAction, // Alias for player
  FrameLayerVisibilityAction,
  FrameEvent,
  AnimationControlTrack,
  AnimationVisibilityTrack,
  AnimationTrack,
  Animation,
  GeppettoImage,
  LayerFolder,
  Folder,
} from "@geppetto/types";

// Import types needed for local type definitions
import type {
  CanvasMetadata,
  ControlDefinition,
  MutationVector,
  FrameControlAction as PreparedControlAction,
} from "@geppetto/types";

// Player-specific types

export type PlayStatus = Record<
  string,
  {
    playing: boolean;
    startAt: number;
    startedAt: number;
  }
>;

// Prepared buffer types for WebGL rendering
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

export type PreparedControlTrack = {
  controlIndex: number;
  actions: PreparedControlAction[];
  length: number; // Track loops at this duration
};

export type PreparedAnimation = {
  name: string;
  duration: number; // Overall animation duration
  looping: boolean;
  tracks: PreparedControlTrack[];
  visibilityTracks: Map<number, [number, boolean][]>;
  events: [number, string][];
};

/**
 * Optimized structure for WebGL rendering
 */
export type PreparedImageDefinition = {
  // Mutation data (matching studio's structure)
  mutators: PreparedFloatBuffer;
  mutatorParents: PreparedIntBuffer;
  mutationValues: PreparedFloatBuffer;
  mutatorMapping: Record<string, number>; // For updating mutation values from controls/animations
  rawMutations: Record<string, MutationVector>; // Raw mutation definitions for interpolation
  
  // Geometry data
  shapeVertices: PreparedFloatBuffer;
  shapeIndices: Uint16Array;
  
  // Layer/shape list (sorted by z-index)
  layers: PreparedLayer[];
  
  // Control data (simplified - no shader optimization)
  controls: PreparedControl[];
  defaultControlValues: Float32Array;
  controlNames: Map<string, number>;
  rawControls: Record<string, ControlDefinition>; // Raw control definitions with steps for interpolation
  
  // Animation data
  animations: PreparedAnimation[];
  animationNames: Map<string, number>;
  layerNames: Map<string, number>;
  
  // Canvas metadata
  metadata: CanvasMetadata;
};
