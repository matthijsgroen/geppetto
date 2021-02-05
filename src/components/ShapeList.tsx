import React from "react";
import { ShapeDefinition } from "../lib/types";
import MenuItem from "./MenuItem";

const displayShapes = (
  shapes: ShapeDefinition[],
  layerSelected: string | null,
  setLayerSelected: (activeLayer: string | null) => void,
  onRename: (oldName: string, newName: string) => void,
  indent = 0
): React.ReactElement[] =>
  shapes.reduce(
    (result, shape) =>
      shape.type === "sprite"
        ? result.concat(
            <MenuItem
              key={shape.name}
              selected={shape.name === layerSelected}
              icon={"📄"}
              label={`${shape.name} (${shape.points.length})`}
              name={shape.name}
              allowRename
              indent={indent}
              onClick={() =>
                setLayerSelected(
                  shape.name === layerSelected ? null : shape.name
                )
              }
              onRename={(newName) => {
                onRename(shape.name, newName);
              }}
            />
          )
        : result
            .concat(
              <MenuItem
                key={shape.name}
                selected={shape.name === layerSelected}
                icon={"📁"}
                label={shape.name}
                name={shape.name}
                allowRename
                indent={indent}
                onClick={() =>
                  setLayerSelected(
                    shape.name === layerSelected ? null : shape.name
                  )
                }
                onRename={(newName) => {
                  onRename(shape.name, newName);
                }}
              />
            )
            .concat(
              displayShapes(
                shape.items,
                layerSelected,
                setLayerSelected,
                onRename,
                indent + 1
              )
            ),
    [] as React.ReactElement[]
  );

interface ShapeListProps {
  shapes: ShapeDefinition[];
  layerSelected: string | null;
  setLayerSelected: (activeLayer: string | null) => void;
  onRename?: (oldName: string, newName: string) => void;
}
const ShapeList: React.FC<ShapeListProps> = ({
  shapes,
  layerSelected,
  setLayerSelected,
  onRename = () => {
    /* noop */
  },
}) => <>{displayShapes(shapes, layerSelected, setLayerSelected, onRename)}</>;

export default ShapeList;
