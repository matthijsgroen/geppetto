import { type Vec2 } from "./common";

/**
 * Base properties for all mutation vectors
 */
type BaseVector = {
  name: string;
  origin: Vec2;
};

/**
 * Translation mutation vector
 */
export type TranslationVector = BaseVector & {
  type: "translate";
  radius: number;
};

/**
 * Deformation mutation vector
 */
export type DeformationVector = BaseVector & {
  type: "deform";
  radius: number;
};

/**
 * Stretch mutation vector
 */
export type StretchVector = BaseVector & {
  type: "stretch";
};

/**
 * Rotation mutation vector
 */
export type RotationVector = BaseVector & {
  type: "rotate";
};

/**
 * Opacity mutation vector
 */
export type OpacityVector = BaseVector & {
  type: "opacity";
};

/**
 * Lightness adjustment mutation vector
 */
export type Lightness = BaseVector & {
  type: "lightness";
};

/**
 * Saturation adjustment mutation vector
 */
export type Saturation = BaseVector & {
  type: "saturation";
};

/**
 * Colorize mutation vector
 */
export type Colorize = BaseVector & {
  type: "colorize";
};

/**
 * Shape mutation vectors (affect geometry and opacity)
 */
export type ShapeMutationVector =
  | TranslationVector
  | DeformationVector
  | StretchVector
  | RotationVector
  | OpacityVector;

/**
 * Color mutation vectors (affect color properties)
 */
export type ColorMutationVector = Lightness | Colorize | Saturation;

/**
 * All mutation vector types
 */
export type MutationVector = ShapeMutationVector | ColorMutationVector;
