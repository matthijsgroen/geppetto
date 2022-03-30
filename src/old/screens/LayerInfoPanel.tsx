import React, { Dispatch, SetStateAction } from "react";
import Menu from "../components/Menu";
import Vec2InputControl from "../components/Vec2InputControl";
import { updateSpriteData } from "../lib/definitionHelpers";
import { ImageDefinition, ShapeDefinition } from "../../animation/file1/types";

interface LayerInfoPanelProps {
  shapeSelected: ShapeDefinition;
  updateImageDefinition: Dispatch<SetStateAction<ImageDefinition>>;
}

const LayerInfoPanel: React.VFC<LayerInfoPanelProps> = ({
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
      <Vec2InputControl
        key={"offset"}
        title={"offset"}
        disabled={shapeSelected === null || shapeSelected.type === "folder"}
        value={
          (shapeSelected &&
            shapeSelected.type === "sprite" &&
            shapeSelected.translate) || [0, 0]
        }
        onChange={(newValue) => {
          if (!shapeSelected) return;
          updateImageDefinition((state) =>
            updateSpriteData(state, shapeSelected.name, (sprite) => ({
              ...sprite,
              translate: newValue,
            }))
          );
        }}
      />,
    ]}
  />
);

export default LayerInfoPanel;
