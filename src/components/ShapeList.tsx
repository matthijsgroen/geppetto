import React from "react";
import { MutationVector, ShapeDefinition } from "../lib/types";
import MenuItem from "./MenuItem";

const iconForType = (type: MutationVector["type"]): string =>
  type === "deform"
    ? "🟠"
    : type === "rotate"
    ? "🔴"
    : type === "stretch"
    ? "🟣"
    : "🟢";

const displayShapes = (
  shapes: ShapeDefinition[],
  layerSelected: string | null,
  setItemSelected: (item: ShapeDefinition | MutationVector | null) => void,
  onRename: (
    oldName: string,
    newName: string,
    item: ShapeDefinition | MutationVector
  ) => void,
  showMutationVectors: boolean,
  indent = 0
): React.ReactElement[] =>
  shapes.reduce(
    (result, shape) =>
      shape.type === "sprite"
        ? result
            .concat(
              <MenuItem
                key={shape.name}
                selected={shape.name === layerSelected}
                icon={"📄"}
                label={`${shape.name} (${shape.points.length})`}
                name={shape.name}
                allowRename
                indent={indent}
                onClick={() =>
                  setItemSelected(shape.name === layerSelected ? null : shape)
                }
                onRename={(newName) => {
                  onRename(shape.name, newName, shape);
                }}
              />
            )
            .concat(
              showMutationVectors
                ? (shape.mutationVectors || ([] as MutationVector[])).map(
                    (vector) => (
                      <MenuItem
                        key={vector.name}
                        // selected={shape.name === layerSelected}
                        icon={iconForType(vector.type)}
                        label={`${vector.name}`}
                        name={vector.name}
                        // allowRename
                        indent={indent + 1}
                        // onClick={() =>
                        //   setLayerSelected(
                        //     shape.name === layerSelected ? null : shape.name
                        //   )
                        // }
                        // onRename={(newName) => {
                        //   onRename(shape.name, newName);
                        // }}
                      />
                    )
                  )
                : []
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
                  setItemSelected(shape.name === layerSelected ? null : shape)
                }
                onRename={(newName) => {
                  onRename(shape.name, newName, shape);
                }}
              />
            )
            .concat(
              displayShapes(
                shape.items,
                layerSelected,
                setItemSelected,
                onRename,
                showMutationVectors,
                indent + 1
              )
            ),
    [] as React.ReactElement[]
  );

interface ShapeListProps {
  shapes: ShapeDefinition[];
  layerSelected: string | null;
  showMutationVectors?: boolean;
  setItemSelected: (item: ShapeDefinition | MutationVector | null) => void;
  onRename?: (
    oldName: string,
    newName: string,
    item: ShapeDefinition | MutationVector
  ) => void;
}
const ShapeList: React.FC<ShapeListProps> = ({
  shapes,
  layerSelected,
  showMutationVectors = false,
  setItemSelected,
  onRename = () => {
    /* noop */
  },
}) => (
  <>
    {displayShapes(
      shapes,
      layerSelected,
      setItemSelected,
      onRename,
      showMutationVectors
    )}
  </>
);

export default ShapeList;
