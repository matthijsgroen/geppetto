import { Vec2 } from "../types";

export type NodeType = "layerFolder" | "layer" | "mutation";
export type TreeNode<Type extends string> = {
  id: string;
  type: Type;
  children?: TreeNode<Type>[];
};

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

type EasingFunction = "easeIn" | "easeOut" | "easeInOut" | "linear";

export type FrameAction =
  | FrameControlAction
  | FrameLayerVisibilityAction
  | FrameEvent;

export type FrameControlAction = {
  controlId: string;
  easingFunction: EasingFunction;
  controlValue: number;
  start: number;
  duration: number;
};

export type FrameLayerVisibilityAction = {
  layerId: string;
  visible: boolean;
  start: number;
};

export type FrameEvent = {
  event: string;
  start: number;
};

type Animation = {
  name: string;
  looping: boolean;
  actions: FrameAction[];
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
  version: string;
  metadata: {
    width: number;
    height: number;
    zoom: number;
    pan: [number, number];
  };
  layerHierarchy: TreeNode<NodeType>[];
  layers: Record<string, Layer>;
  mutations: Record<string, MutationVector>;
  layerFolders: Record<string, LayerFolder>;

  defaultFrame: Record<string, Vec2>;
  controlHierarchy: TreeNode<"controlFolder" | "control">[];
  controlFolders: Record<string, Folder>;
  controls: Record<string, ControlDefinition>;
  controlValues: Record<string, number>;

  animationHierarchy: TreeNode<"animationFolder" | "animation">[];
  animationFolders: Record<string, Folder>;
  animations: Record<string, Animation>;
};
