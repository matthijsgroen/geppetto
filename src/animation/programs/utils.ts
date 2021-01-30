import { ShapeDefinition, SpriteDefinition } from "../../lib/types";

export const flattenShapes = (shapes: ShapeDefinition[]): SpriteDefinition[] =>
  shapes.reduce(
    (result, shape) =>
      result.concat(
        shape.type === "sprite" ? shape : flattenShapes(shape.items)
      ),
    [] as SpriteDefinition[]
  );
