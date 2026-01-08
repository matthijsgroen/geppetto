import { type Vec2 } from "./common";

/**
 * A layer definition containing points and transformation
 */
export type Layer = {
  name: string;
  visible: boolean;
  points: Vec2[];
  translate: Vec2;
};

/**
 * Base folder properties
 */
export type Folder = {
  name: string;
  collapsed: boolean;
};

/**
 * A folder containing layers
 */
export type LayerFolder = Folder & {
  visible: boolean;
};
