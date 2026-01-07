import { type Vec2 } from "@/shared/types/global";

export type NodeType = "layerFolder" | "layer" | "mutation";
export type TreeNode<Type extends string> = {
  type: Type;
  parentId: string;
  children?: string[];
};

export type RootNode = {
  type: "root";
  children: string[];
};

export type Hierarchy<Type extends string> = Record<
  string,
  TreeNode<Type> | RootNode
>;

export type Layer = {
  name: string;
  visible: boolean;
  points: Vec2[];
  translate: Vec2;
};

export type Folder = {
  name: string;
  collapsed: boolean;
};

export type LayerFolder = Folder & {
  visible: boolean;
};

export type EasingFunction = "easeIn" | "easeOut" | "easeInOut" | "linear";

export type FrameAction =
  | FrameControlAction
  | FrameLayerVisibilityAction
  | FrameEvent;

export type FrameControlAction = {
  start: number;
  easingFunction: EasingFunction;
  controlEndValue: number;
  controlStartValue?: number;
  duration: number;
};

export type FrameLayerVisibilityAction = {
  start: number;
  visible: boolean;
};

export type FrameEvent = {
  start: number;
  eventName: string;
};

export type AnimationTrack = AnimationControlTrack | AnimationVisibilityTrack;

export type AnimationControlTrack = {
  type: "control";
  controlId: string;
  actions: FrameControlAction[];
  length: number;
};

export type AnimationVisibilityTrack = {
  type: "visibility";
  layerId: string;
  actions: FrameLayerVisibilityAction[];
  length: number;
};

export type Animation = {
  name: string;
  looping: boolean;
  tracks: AnimationTrack[];
  events: FrameEvent[];
};

type BaseVector = {
  name: string;
  origin: Vec2;
};

export type TranslationVector = BaseVector & {
  type: "translate";
  radius: number;
};

export type DeformationVector = BaseVector & {
  type: "deform";
  radius: number;
};

export type StretchVector = BaseVector & {
  type: "stretch";
};

export type RotationVector = BaseVector & {
  type: "rotate";
};

export type OpacityVector = BaseVector & {
  type: "opacity";
};

export type Lightness = BaseVector & {
  type: "lightness";
};

export type Saturation = BaseVector & {
  type: "saturation";
};

export type Colorize = BaseVector & {
  type: "colorize";
};

export type MutationVector = ShapeMutationVector | ColorMutationVector;

export type ColorMutationVector = Lightness | Colorize | Saturation;

export type ShapeMutationVector =
  | TranslationVector
  | DeformationVector
  | StretchVector
  | RotationVector
  | OpacityVector;

export type Keyframe = Record<string, Vec2>;

export type ControlDefinition = {
  name: string;
  type: "slider";
  steps: Keyframe[];
};

export type GeppettoImage = {
  version: `2.${number}`;
  metadata: {
    width: number;
    height: number;
    zoom: number;
    pan: [number, number];
  };
  layerHierarchy: Hierarchy<NodeType>;
  layers: Record<string, Layer>;
  mutations: Record<string, MutationVector>;
  layerFolders: Record<string, LayerFolder>;

  defaultFrame: Record<string, Vec2>;
  controlHierarchy: Hierarchy<"controlFolder" | "control">;
  controlFolders: Record<string, Folder>;
  controls: Record<string, ControlDefinition>;
  controlValues: Record<string, number>;

  animations: Record<string, Animation>;
};
