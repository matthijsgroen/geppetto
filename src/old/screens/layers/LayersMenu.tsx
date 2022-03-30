import React, { Dispatch, SetStateAction, useCallback } from "react";
import Menu from "../../components/Menu";
import ShapeList from "../../components/ShapeList";
import ToolbarButton from "../../components/ToolbarButton";
import {
  addFolder,
  addLayer,
  canDelete,
  canMoveDown,
  canMoveUp,
  getShape,
  makeLayerName,
  moveDown,
  moveUp,
  removeItem,
  renameLayer,
} from "../../lib/definitionHelpers";
import { Vec2 } from "../../../application/types";
import {
  ImageDefinition,
  ItemSelection,
  MutationVector,
  ShapeDefinition,
  SpriteDefinition,
} from "../../../application/animation/file1-types";

type Props = {
  imageDefinition: ImageDefinition;
  updateImageDefinition: Dispatch<SetStateAction<ImageDefinition>>;
  layerSelected: ItemSelection | null;
  setLayerSelected: Dispatch<SetStateAction<ItemSelection | null>>;
};

const LayersMenu: React.FunctionComponent<Props> = ({
  imageDefinition,
  updateImageDefinition,
  layerSelected,
  setLayerSelected,
}) => {
  const setItemSelected = useCallback(
    (item: ShapeDefinition | MutationVector | null) => {
      setLayerSelected(
        item === null
          ? null
          : {
              name: item.name,
              type: item.type === "folder" ? "folder" : "layer",
            }
      );
    },
    [setLayerSelected]
  );
  return (
    <Menu
      key="layers"
      title="Layers"
      size="large"
      toolbarItems={[
        <ToolbarButton
          key="addLayer"
          hint="Add layer"
          icon="📄"
          label="+"
          size="small"
          onClick={async () => {
            const newSprite = await addLayer(
              updateImageDefinition,
              "New Layer",
              layerSelected?.name
            );
            setItemSelected(newSprite);
          }}
        />,
        <ToolbarButton
          key="addFolder"
          hint="Add folder"
          icon="📁"
          label="+"
          size="small"
          onClick={async () => {
            const newFolder = await addFolder(
              updateImageDefinition,
              "New Folder",
              layerSelected?.name
            );
            setItemSelected(newFolder);
          }}
        />,
        <ToolbarButton
          key="copy"
          hint="Copy layer"
          icon="📝"
          size="small"
          disabled={!(layerSelected && layerSelected.type === "layer")}
          label=""
          onClick={async () => {
            const shapeSelected = layerSelected
              ? getShape(imageDefinition, layerSelected.name)
              : null;
            if (
              shapeSelected === null ||
              layerSelected === null ||
              layerSelected.type !== "layer"
            ) {
              return;
            }
            const newSprite = await addLayer(
              updateImageDefinition,
              layerSelected.name,
              layerSelected.name,
              {
                points: ([] as Vec2[]).concat(
                  (shapeSelected as SpriteDefinition).points
                ),
              }
            );
            setItemSelected(newSprite);
          }}
        />,
        <ToolbarButton
          key="remove"
          hint="Remove item"
          icon="🗑"
          size="small"
          disabled={!canDelete(layerSelected, imageDefinition)}
          label=""
          onClick={() => {
            if (layerSelected === null) {
              return;
            }
            setItemSelected(null);
            updateImageDefinition((state) => removeItem(state, layerSelected));
          }}
        />,
        <ToolbarButton
          key="moveUp"
          hint="Move item down"
          icon="⬆"
          size="small"
          disabled={!canMoveUp(layerSelected, imageDefinition)}
          label=""
          onClick={() => {
            if (layerSelected === null) {
              return;
            }
            updateImageDefinition((state) => moveUp(state, layerSelected));
          }}
        />,
        <ToolbarButton
          key="moveDown"
          hint="Move item up"
          icon="⬇"
          size="small"
          disabled={!canMoveDown(layerSelected, imageDefinition)}
          label=""
          onClick={() => {
            if (layerSelected === null) {
              return;
            }
            updateImageDefinition((state) => moveDown(state, layerSelected));
          }}
        />,
      ]}
      items={
        <ShapeList
          shapes={imageDefinition.shapes}
          layerSelected={layerSelected}
          showPoints={true}
          setItemSelected={setItemSelected}
          onRename={(oldName, newName, item) => {
            const layerName = makeLayerName(
              imageDefinition,
              newName,
              layerSelected ? layerSelected.name : null
            );
            updateImageDefinition((state) =>
              renameLayer(state, oldName, layerName)
            );
            setLayerSelected({
              name: layerName,
              type: item.type === "folder" ? "folder" : "layer",
            });
          }}
        />
      }
    />
  );
};

export default LayersMenu;
