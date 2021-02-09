import React from "react";
import Menu from "src/components/Menu";
import NumberInputControl from "src/components/NumberInputControl";
import { updateSpriteData } from "src/lib/definitionHelpers";
import { ImageDefinition, ShapeDefinition } from "src/lib/types";

interface LayerInfoPanelProps {
  shapeSelected: ShapeDefinition;
  updateImageDefinition(
    mutation: (oldState: ImageDefinition) => ImageDefinition
  ): void;
}

const LayerInfoPanel: React.FC<LayerInfoPanelProps> = ({
  shapeSelected,
  updateImageDefinition,
}) => (
  <Menu
    title={
      shapeSelected.type === "sprite"
        ? `📄 ${shapeSelected.name}`
        : `📁 ${shapeSelected.name}`
    }
    key="info"
    collapsable={true}
    size="minimal"
    items={[
      <NumberInputControl
        key={"x"}
        title={"xOffset"}
        disabled={shapeSelected === null || shapeSelected.type === "folder"}
        value={
          (shapeSelected &&
            shapeSelected.type === "sprite" &&
            shapeSelected.baseElementData.translateX) ||
          0
        }
        onChange={(newValue) => {
          if (!shapeSelected) return;
          updateImageDefinition((state) =>
            updateSpriteData(state, shapeSelected.name, (sprite) => ({
              ...sprite,
              baseElementData: {
                ...sprite.baseElementData,
                translateX: newValue,
              },
            }))
          );
        }}
      />,
      <NumberInputControl
        key={"y"}
        title={"yOffset"}
        disabled={shapeSelected === null || shapeSelected.type === "folder"}
        value={
          (shapeSelected &&
            shapeSelected.type === "sprite" &&
            shapeSelected.baseElementData.translateY) ||
          0
        }
        onChange={(newValue) => {
          if (!shapeSelected) return;
          updateImageDefinition((state) =>
            updateSpriteData(state, shapeSelected.name, (sprite) => ({
              ...sprite,
              baseElementData: {
                ...sprite.baseElementData,
                translateY: newValue,
              },
            }))
          );
        }}
      />,
    ]}
  />
);

export default LayerInfoPanel;
