import type { GeppettoImage } from "@geppetto/types";

export const hasAnimations = (file: GeppettoImage) =>
  Object.keys(file.animations).length > 0;

export const hasAnimationsWithData = (file: GeppettoImage) =>
  Object.values(file.animations).some(
    (animation) => Object.keys(animation.tracks).length > 0
  );
