import React from "react";
import { ShapeDefinition } from "../lib/types";
import MenuItem from "./MenuItem";

const displayShapes = (
  shapes: ShapeDefinition[],
  layerSelected: string | null,
  setLayerSelected: (activeLayer: string | null) => void,
  indent = 0
): React.ReactElement[] =>
  shapes.reduce(
    (result, shape) =>
      shape.type === "sprite"
        ? result.concat(
            <MenuItem
              key={shape.name}
              selected={shape.name === layerSelected}
              name={`📄 ${shape.name} (${shape.points.length})`}
              indent={indent}
              onClick={() =>
                setLayerSelected(
                  shape.name === layerSelected ? null : shape.name
                )
              }
            />
          )
        : result
            .concat(
              <MenuItem
                key={shape.name}
                selected={shape.name === layerSelected}
                name={`📁 ${shape.name}`}
                indent={indent}
                onClick={() =>
                  setLayerSelected(
                    shape.name === layerSelected ? null : shape.name
                  )
                }
              />
            )
            .concat(
              displayShapes(
                shape.items,
                layerSelected,
                setLayerSelected,
                indent + 1
              )
            ),
    [] as React.ReactElement[]
  );

interface ShapeListProps {
  shapes: ShapeDefinition[];
  layerSelected: string | null;
  setLayerSelected: (activeLayer: string | null) => void;
}
const ShapeList: React.FC<ShapeListProps> = ({
  shapes,
  layerSelected,
  setLayerSelected,
}) => <>{displayShapes(shapes, layerSelected, setLayerSelected)}</>;

export default ShapeList;
