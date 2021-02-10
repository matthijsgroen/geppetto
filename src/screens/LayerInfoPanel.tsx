import React from "react";
import Menu from "src/components/Menu";
import NumberInputControl from "src/components/NumberInputControl";
import { updateSpriteData } from "src/lib/definitionHelpers";
import { ImageDefinition, ShapeDefinition, Vec2 } from "src/lib/types";

interface LayerInfoPanelProps {
  shapeSelected: ShapeDefinition;
  updateImageDefinition(
    mutation: (oldState: ImageDefinition) => ImageDefinition
  ): void;
}

const vector2X = (x: number, vec: Vec2 = [0, 0]): Vec2 => [x, vec[1]];
const vector2Y = (y: number, vec: Vec2 = [0, 0]): Vec2 => [vec[0], y];
const getX = (vec: Vec2 = [0, 0]): number => vec[0];
const getY = (vec: Vec2 = [0, 0]): number => vec[1];

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
                translate: vector2X(newValue, sprite.baseElementData.translate),
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
