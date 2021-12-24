import {
  ControlDefinition,
  ControlValues,
  MutationVector,
  Vec2,
} from "../types";

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

type LayerMutation = WithID<MutationVector> & {
  parent: string;
};

type EasingFunction = "easeIn" | "easeOut" | "easeInOut" | "linear";

type AnimationFrame = {
  controlValues: ControlValues;
  easingFunction: EasingFunction;
  hideLayers: string[];
  showLayers: string[];
  event?: string;
  time: number;
};

type Animation = {
  name: string;
  looping: boolean;
  keyframes: AnimationFrame[];
};

export type GeppettoImage = {
  layerHierarchy: Folder[];
  layers: Layer[];
  mutations: LayerMutation[];
  defaultFrame: Record<string, Vec2>;

  layersHidden: string[];
  names: Record<string, string>;

  controls: WithID<ControlDefinition>[];
  controlValues: ControlValues;

  animationHierarchy: Folder[];
  animations: WithID<Animation>[];
  version: string;
};
