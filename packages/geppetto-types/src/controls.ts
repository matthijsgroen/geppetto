import { type Vec2 } from "./common";

/**
 * A keyframe mapping control names to Vec2 values
 */
export type Keyframe = Record<string, Vec2>;

/**
 * A control definition (slider) with multiple steps
 */
export type ControlDefinition = {
  name: string;
  type: "slider";
  steps: Keyframe[];
};
