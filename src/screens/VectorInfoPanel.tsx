import React from "react";
import Menu from "src/components/Menu";
import NumberInputControl from "src/components/NumberInputControl";
import SelectControl from "src/components/SelectControl";
import Vect2InputControl from "src/components/Vec2InputControl";
import { updateVectorData } from "src/lib/definitionHelpers";
import { ImageDefinition, MutationVector, Vec2 } from "src/lib/types";

interface VectorInfoPanelProps {
  vectorSelected: MutationVector;
  updateImageDefinition(
    mutation: (oldState: ImageDefinition) => ImageDefinition
  ): void;
}

type VectorTypes = MutationVector["type"];

const createVector = (
  name: string,
  origin: Vec2,
  newType: VectorTypes
): MutationVector => {
  switch (newType) {
    case "deform":
      return { type: "deform", origin, name, radius: 10 };
    case "rotate":
      return { type: "rotate", origin, name };
    case "stretch":
      return { type: "stretch", origin, name };
    case "translate":
      return { type: "translate", origin, name };
  }
};

const iconForType = (type: VectorTypes): string =>
  (({
    deform: "🟠",
    rotate: "🔴",
    stretch: "🟣",
    translate: "🟢",
  } as Record<VectorTypes, string>)[type]);

const VectorInfoPanel: React.FC<VectorInfoPanelProps> = ({
  vectorSelected,
  updateImageDefinition,
}) => (
  <Menu
    title={`${iconForType(vectorSelected.type)} ${vectorSelected.name}`}
    collapsable={true}
    size="minimal"
    items={[
      <SelectControl
        key={"type"}
        title={"Type"}
        value={vectorSelected.type}
        options={[
          {
            name: "Deformation",
            id: "deform",
            value: "deform" as VectorTypes,
          },
          {
            name: "Translation",
            id: "translate",
            value: "translate" as VectorTypes,
          },
          {
            name: "Rotation",
            id: "rotate",
            value: "rotate" as VectorTypes,
          },
          {
            name: "Stretch",
            id: "stretch",
            value: "stretch" as VectorTypes,
          },
        ]}
        onChange={(newValue) => {
          updateImageDefinition((state) =>
            updateVectorData(state, vectorSelected.name, (vector) =>
              createVector(vector.name, vector.origin, newValue.value)
            )
          );
        }}
      />,
      <Vect2InputControl
        key={"origin"}
        title={"origin"}
        value={vectorSelected.origin}
        onChange={(newValue) => {
          updateImageDefinition((state) =>
            updateVectorData(state, vectorSelected.name, (vector) => ({
              ...vector,
              origin: newValue,
            }))
          );
        }}
      />,
      ...(vectorSelected.type === "deform"
        ? [
            <NumberInputControl
              key={"radius"}
              title={"radius"}
              value={vectorSelected.radius}
              onChange={(newValue) => {
                updateImageDefinition((state) =>
                  updateVectorData(state, vectorSelected.name, (vector) => ({
                    ...vector,
                    radius: newValue,
                  }))
                );
              }}
            />,
          ]
        : []),
      <Vect2InputControl
        key={"value"}
        title={"value"}
        value={vectorSelected.value || [0, 0]}
        onChange={(newValue) => {
          updateImageDefinition((state) =>
            updateVectorData(state, vectorSelected.name, (vector) => ({
              ...vector,
              value: newValue,
            }))
          );
        }}
      />,
    ]}
  />
);

export default VectorInfoPanel;
