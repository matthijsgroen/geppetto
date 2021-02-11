import React from "react";
import Menu from "src/components/Menu";
import NumberInputControl from "src/components/NumberInputControl";
import { updateSpriteData } from "src/lib/definitionHelpers";
import { ImageDefinition, ShapeDefinition } from "src/lib/types";
import { getX, getY, vector2Y } from "src/lib/vertices";

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
            getX(shapeSelected.baseElementData.translate)) ||
          0
        }
        onChange={(newValue) => {
          if (!shapeSelected) return;
          updateImageDefinition((state) =>
            updateSpriteData(state, shapeSelected.name, (sprite) => ({
              ...sprite,
              baseElementData: {
                ...sprite.baseElementData,
                translate: vector2Y(newValue, sprite.baseElementData.translate),
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
            getY(shapeSelected.baseElementData.translate)) ||
          0
        }
        onChange={(newValue) => {
          if (!shapeSelected) return;
          updateImageDefinition((state) =>
            updateSpriteData(state, shapeSelected.name, (sprite) => ({
              ...sprite,
              baseElementData: {
                ...sprite.baseElementData,
                translate: vector2Y(newValue, sprite.baseElementData.translate),
              },
            }))
          );
        }}
      />,
    ]}
  />
);

export default LayerInfoPanel;
