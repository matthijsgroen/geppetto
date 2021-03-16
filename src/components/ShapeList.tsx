import React from "react";
import { ItemSelection, MutationVector, ShapeDefinition } from "../lib/types";
import MenuItem from "./MenuItem";

type VectorTypes = MutationVector["type"];

const iconForType = (type: VectorTypes): string =>
  (({
    deform: "🟠",
    rotate: "🔴",
    stretch: "🟣",
    translate: "🟢",
    opacity: "⚪️",
  } as Record<VectorTypes, string>)[type]);

const displayShapes = (
  shapes: ShapeDefinition[],
  layerSelected: ItemSelection | null,
  setItemSelected: (item: ShapeDefinition | MutationVector | null) => void,
  onRename: (
    oldName: string,
    newName: string,
    item: ShapeDefinition | MutationVector
  ) => void,
  showMutationVectors: boolean,
  showPoints: boolean,
  showSetMutationVectors: string[],
  indent = 0
): React.ReactElement[] =>
  shapes.reduce(
    (result, shape) =>
      shape.type === "sprite"
        ? result
            .concat(
              <MenuItem
                key={shape.name}
                selected={
                  !!(
                    layerSelected &&
                    shape.name === layerSelected.name &&
                    layerSelected.type === "layer"
                  )
                }
                icon={"📄"}
                label={
                  showPoints
                    ? `${shape.name} (${shape.points.length})`
                    : shape.name
                }
                name={shape.name}
                allowRename
                indent={indent}
                onClick={() =>
                  setItemSelected(
                    layerSelected?.type === "layer" &&
                      shape.name === layerSelected.name
                      ? null
                      : shape
                  )
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
                        key={`__v-${vector.name}`}
                        selected={
                          !!(
                            layerSelected &&
                            vector.name === layerSelected.name &&
                            layerSelected.type === "vector"
                          )
                        }
                        icon={iconForType(vector.type)}
                        label={
                          showSetMutationVectors.includes(vector.name)
                            ? `${vector.name} - set`
                            : vector.name
                        }
                        dimmed={
                          showSetMutationVectors.length > 0 &&
                          !showSetMutationVectors.includes(vector.name)
                        }
                        name={vector.name}
                        allowRename
                        indent={indent + 1}
                        onClick={() =>
                          setItemSelected(
                            layerSelected?.type === "vector" &&
                              vector.name === layerSelected.name
                              ? null
                              : vector
                          )
                        }
                        onRename={(newName) => {
                          onRename(vector.name, newName, vector);
                        }}
                      />
                    )
                  )
                : []
            )
        : result
            .concat(
              <MenuItem
                key={shape.name}
                selected={
                  !!(
                    layerSelected &&
                    shape.name === layerSelected.name &&
                    layerSelected.type === "layer"
                  )
                }
                icon={"📁"}
                label={shape.name}
                name={shape.name}
                allowRename
                indent={indent}
                onClick={() =>
                  setItemSelected(
                    layerSelected?.type === "layer" &&
                      shape.name === layerSelected.name
                      ? null
                      : shape
                  )
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
                        key={`__v-${vector.name}`}
                        selected={
                          !!(
                            layerSelected &&
                            vector.name === layerSelected.name &&
                            layerSelected.type === "vector"
                          )
                        }
                        icon={iconForType(vector.type)}
                        label={
                          showSetMutationVectors.includes(vector.name)
                            ? `${vector.name} - set`
                            : vector.name
                        }
                        dimmed={
                          showSetMutationVectors.length > 0 &&
                          !showSetMutationVectors.includes(vector.name)
                        }
                        name={vector.name}
                        allowRename
                        indent={indent + 1}
                        onClick={() =>
                          setItemSelected(
                            layerSelected?.type === "vector" &&
                              vector.name === layerSelected.name
                              ? null
                              : vector
                          )
                        }
                        onRename={(newName) => {
                          onRename(vector.name, newName, vector);
                        }}
                      />
                    )
                  )
                : []
            )
            .concat(
              displayShapes(
                shape.items,
                layerSelected,
                setItemSelected,
                onRename,
                showMutationVectors,
                showPoints,
                showSetMutationVectors,
                indent + 1
              )
            ),
    [] as React.ReactElement[]
  );

interface ShapeListProps {
  shapes: ShapeDefinition[];
  layerSelected: ItemSelection | null;
  showMutationVectors?: boolean;
  showSetMutationVectors?: string[];
  showPoints?: boolean;
  setItemSelected: (item: ShapeDefinition | MutationVector | null) => void;
  onRename?: (
    oldName: string,
    newName: string,
    item: ShapeDefinition | MutationVector
  ) => void;
}
const ShapeList: React.VFC<ShapeListProps> = ({
  shapes,
  layerSelected,
  showMutationVectors = false,
  showPoints = false,
  showSetMutationVectors = [],
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
      showMutationVectors,
      showPoints,
      showSetMutationVectors
    )}
  </>
);

export default ShapeList;
