// Type definitions copied from @geppetto/types v2.x to avoid runtime dependencies

/**
 * A 2D vector represented as [x, y]
 */
export type Vec2 = [x: number, y: number];

/**
 * A 3D vector represented as [x, y, z]
 */
export type Vec3 = [x: number, y: number, z: number];

/**
 * A 4D vector represented as [x, y, z, w]
 */
export type Vec4 = [x: number, y: number, z: number, w: number];

/**
 * Types of easing functions for animation interpolation
 */
export type EasingFunction = "linear" | "easeIn" | "easeOut" | "easeInOut";

/**
 * Base properties for all mutation vectors
 */
type BaseMutationVector = {
  name: string;
  origin: Vec2;
};

/**
 * Translation mutation vector
 */
export type TranslationVector = BaseMutationVector & {
  type: "translate";
  radius: number;
};

/**
 * Rotation mutation vector  
 */
export type RotationVector = BaseMutationVector & {
  type: "rotate";
};

/**
 * Deform mutation vector
 */
export type DeformVector = BaseMutationVector & {
  type: "deform";
  radius: number;
};

/**
 * Stretch mutation vector
 */
export type StretchVector = BaseMutationVector & {
  type: "stretch";
};

/**
 * Opacity mutation vector
 */
export type OpacityVector = BaseMutationVector & {
  type: "opacity";
};

/**
 * Lightness mutation vector
 */
export type LightnessVector = BaseMutationVector & {
  type: "lightness";
};

/**
 * Saturation mutation vector
 */
export type SaturationVector = BaseMutationVector & {
  type: "saturation";
};

/**
 * Hue mutation vector  
 */
export type HueVector = BaseMutationVector & {
  type: "hue";
};

/**
 * Color Tint mutation vector
 */
export type ColorTintVector = BaseMutationVector & {
  type: "colorize";
};

/**
 * Union type of all mutation vectors
 */
export type MutationVector =
  | TranslationVector
  | RotationVector
  | DeformVector
  | StretchVector
  | OpacityVector
  | LightnessVector
  | SaturationVector
  | HueVector
  | ColorTintVector;

/**
 * Control step definition (keyframe data for mutations)
 */
export type ControlStep = Record<string, Vec2>;

/**
 * Control definition
 */
export type ControlDefinition = {
  name: string;
  type: "slider";
  steps: ControlStep[];
};

/**
 * Tree node types
 */
export type TreeNode<T extends string> = {
  type: T;
  parentId: string;
  children?: string[];
};

export type RootNode = {
  type: "root";
  children: string[];
};

/**
 * Hierarchy structure
 */
export type Hierarchy<T extends string> = Record<string, TreeNode<T> | RootNode>;

/**
 * Layer definition
 */
export type Layer = {
  name: string;
  visible: boolean;
  points: Vec2[];
  translate: Vec2;
};

/**
 * Frame control action
 */
export type FrameControlAction = {
  start: number;
  easingFunction: EasingFunction;
  controlEndValue: number;
  controlStartValue?: number;
  duration: number;
};

/**
 * Frame layer visibility action
 */
export type FrameLayerVisibilityAction = {
  start: number;
  visible: boolean;
};

/**
 * Frame event
 */
export type FrameEvent = {
  start: number;
  eventName: string;
};

/**
 * Animation control track
 */
export type AnimationControlTrack = {
  type: "control";
  controlId: string;
  actions: FrameControlAction[];
  length: number;
};

/**
 * Animation visibility track
 */
export type AnimationVisibilityTrack = {
  type: "visibility";
  layerId: string;
  actions: FrameLayerVisibilityAction[];
  length: number;
};

/**
 * Animation event track
 */
export type AnimationEventTrack = {
  type: "event";
  keyframes: Record<number, FrameEvent>;
  length: number;
};

/**
 * Union of animation track types
 */
export type AnimationTrack =
  | AnimationControlTrack
  | AnimationVisibilityTrack
  | AnimationEventTrack;

/**
 * Animation definition
 */
export type Animation = {
  name: string;
  looping: boolean;
  tracks: AnimationTrack[];
  events: FrameEvent[];
};

/**
 * Canvas metadata
 */
export type CanvasMetadata = {
  width: number;
  height: number;
  zoom: number;
  pan: Vec2;
};

/**
 * Layer folder definition
 */
export type LayerFolder = {
  name: string;
  visible: boolean;
  collapsed: boolean;
};

/**
 * Folder definition
 */
export type Folder = {
  name: string;
  collapsed: boolean;
};

/**
 * Complete Geppetto image definition
 */
export type GeppettoImage = {
  version: string;
  metadata: CanvasMetadata;
  layerHierarchy: Hierarchy<"layer" | "layerFolder" | "mutation">;
  layers: Record<string, Layer>;
  layerFolders: Record<string, LayerFolder>;
  mutations: Record<string, MutationVector>;
  defaultFrame: Record<string, Vec2>;
  controlHierarchy: Hierarchy<"control" | "folder">;
  controlFolders: Record<string, Folder>;
  controls: Record<string, ControlDefinition>;
  controlValues: Record<string, number>;
  animations: Record<string, Animation>;
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

export type PreparedControlAction = {
  start: number;
  duration: number;
  easingFunction: EasingFunction;
  controlEndValue: number;
  controlStartValue?: number; // If undefined, use current control value
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
