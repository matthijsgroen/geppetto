import { ControlDefinition, ControlValues, Vec2 } from "../types";

export type Folder = {
  id: string;
  collapsed: boolean;
  children: string[];
};

export type Layer = {
  id: string;
  points: Vec2[];
  translate: Vec2;
};

type WithID<T> = Omit<T, "name"> & { id: string };

type EasingFunction = "easeIn" | "easeOut" | "easeInOut" | "linear";

type FrameAction = FrameControlAction | FrameLayerVisibilityAction | FrameEvent;

type FrameControlAction = {
  controlId: string;
  easingFunction: EasingFunction;
  controlValue: number;
  time: number;
};

type FrameLayerVisibilityAction = {
  layerId: string;
  visible: boolean;
  time: number;
};

type FrameEvent = {
  event: string;
  time: number;
};

type Animation = {
  id: string;
  looping: boolean;
  keyframes: FrameAction[];
};

type BaseVector = {
  id: string;
  parentId: string;
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

export type GeppettoImage = {
  version: string;
  metadata: {
    width: number;
    height: number;
    zoom: number;
    pan: [number, number];
  };
  layers: Layer[];
  mutations: MutationVector[];

  layerHierarchy: Folder[];
  defaultFrame: Record<string, Vec2>;

  layersHidden: string[];
  names: Record<string, string>;

  controls: WithID<ControlDefinition>[];
  controlValues: ControlValues;

  animationHierarchy: Folder[];
  animations: Animation[];
};
