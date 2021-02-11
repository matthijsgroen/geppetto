import React from "react";
import Menu from "src/components/Menu";
import NumberInputControl from "src/components/NumberInputControl";
import { updateVectorData } from "src/lib/definitionHelpers";
import { ImageDefinition, MutationVector } from "src/lib/types";
import { vector2X, vector2Y } from "src/lib/vertices";

interface VectorInfoPanelProps {
  vectorSelected: MutationVector;
  updateImageDefinition(
    mutation: (oldState: ImageDefinition) => ImageDefinition
  ): void;
}

type VectorTypes = MutationVector["type"];

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
    key="info"
    collapsable={true}
    size="minimal"
    items={[
      <NumberInputControl
        key={"x"}
        title={"x"}
        value={vectorSelected.origin[0]}
        onChange={(newValue) => {
          updateImageDefinition((state) =>
            updateVectorData(state, vectorSelected.name, (vector) => ({
              ...vector,
              origin: vector2X(newValue, vector.origin),
            }))
          );
        }}
      />,
      <NumberInputControl
        key={"y"}
        title={"y"}
        value={vectorSelected.origin[1]}
        onChange={(newValue) => {
          updateImageDefinition((state) =>
            updateVectorData(state, vectorSelected.name, (vector) => ({
              ...vector,
              origin: vector2Y(newValue, vector.origin),
            }))
          );
        }}
      />,
    ]}
  />
);

export default VectorInfoPanel;
