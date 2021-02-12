import React, { useCallback, useEffect, useState } from "react";
import TextureMapCanvas from "../animation/TextureMapCanvas";
import Menu from "../components/Menu";
import MouseControl, { MouseMode } from "../components/MouseControl";
import ShapeList from "../components/ShapeList";
import ToolbarButton from "../components/ToolbarButton";
import ToolbarSeperator from "../components/ToolbarSeperator";
import {
  addFolder,
  addLayer,
  addPoint,
  canDelete,
  canMoveDown,
  canMoveUp,
  getLayerNames,
  getShape,
  makeLayerName,
  moveDown,
  moveUp,
  removeItem,
  removePoint,
  renameLayer,
} from "../lib/definitionHelpers";
import {
  ImageDefinition,
  ItemSelection,
  MutationVector,
  ShapeDefinition,
} from "../lib/types";
import { getTextureCoordinate } from "../lib/webgl";
import ScreenLayout from "../templates/ScreenLayout";

interface LayersProps {
  imageDefinition: ImageDefinition;
  texture: HTMLImageElement | null;
  updateImageDefinition(
    mutator: (previousImageDefinition: ImageDefinition) => ImageDefinition
  ): void;
}

const Layers: React.FC<LayersProps> = ({
  texture,
  imageDefinition,
  updateImageDefinition,
}) => {
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0.0);
  const [panY, setPanY] = useState(0.0);
  const [isMouseDown, setIsMouseDown] = useState<false | [number, number]>(
    false
  );
  const [activeCoord, setActiveCoord] = useState<null | [number, number]>(null);
  const [layerSelected, setLayerSelected] = useState<null | ItemSelection>(
    null
  );
  const [mouseMode, setMouseMode] = useState(MouseMode.Grab);

  const setItemSelected = useCallback(
    (item: ShapeDefinition | MutationVector | null) => {
      setLayerSelected(
        item === null ? null : { name: item.name, type: "layer" }
      );
    },
    [setLayerSelected]
  );

  useEffect(() => {
    if (layerSelected === null) {
      setMouseMode(MouseMode.Grab);
      setActiveCoord(null);
    }
  }, [layerSelected]);

  useEffect(() => {
    if (!layerSelected) {
      return;
    }
    const names = getLayerNames(imageDefinition.shapes);
    if (!names.includes(layerSelected.name)) {
      setLayerSelected(null);
    }
  }, [imageDefinition]);

  const mouseDown = (event: React.MouseEvent) => {
    const canvasPos = event.currentTarget.getBoundingClientRect();
    const elementX = event.pageX - canvasPos.left;
    const elementY = event.pageY - canvasPos.top;
    setIsMouseDown([elementX, elementY]);
  };

  const mouseMove = (event: React.MouseEvent) => {
    if (isMouseDown) {
      const canvasPos = event.currentTarget.getBoundingClientRect();
      const elementX = event.pageX - canvasPos.left;
      const elementY = event.pageY - canvasPos.top;
      setIsMouseDown([elementX, elementY]);
      const deltaX = elementX - isMouseDown[0];
      const deltaY = elementY - isMouseDown[1];

      const newPanX = Math.min(
        1.0,
        Math.max(
          panX + ((deltaX / canvasPos.width) * window.devicePixelRatio) / zoom,
          -1.0
        )
      );
      setPanX(newPanX);

      const newPanY = Math.min(
        1.0,
        Math.max(
          panY +
            ((deltaY / canvasPos.height) * window.devicePixelRatio * -1.0) /
              zoom,
          -1.0
        )
      );
      setPanY(newPanY);
    }
  };

  const mouseUp = (event: React.MouseEvent) => {
    if (mouseMode === MouseMode.Aim && texture && layerSelected) {
      const canvasPos = event.currentTarget.getBoundingClientRect();
      const elementX = event.pageX - canvasPos.left;
      const elementY = event.pageY - canvasPos.top;
      const coord = getTextureCoordinate(
        [canvasPos.width, canvasPos.height],
        [texture.width, texture.height],
        [panX, panY],
        zoom,
        [elementX, elementY]
      );
      const shape = getShape(imageDefinition, layerSelected.name);
      if (shape && shape.type === "sprite") {
        const closePoint = shape.points.find((p) => {
          const dx = p[0] - coord[0];
          const dy = p[1] - coord[1];

          return (
            dx > -6 / zoom && dx < 6 / zoom && dy > -6 / zoom && dy < 6 / zoom
          );
        });

        if (!closePoint) {
          updateImageDefinition((state) =>
            addPoint(state, layerSelected.name, coord)
          );
          setActiveCoord(coord);
        } else {
          setActiveCoord(closePoint);
        }
      }
    }
    setIsMouseDown(false);
  };

  const mouseWheel = (delta: number) => {
    const z = Math.min(4.0, Math.max(0.1, zoom - delta / 100));
    setZoom(z);
  };

  return (
    <ScreenLayout
      menus={
        <Menu
          title="Layers"
          toolbarItems={[
            <ToolbarButton
              key="addLayer"
              icon="📄"
              label="+"
              size="small"
              onClick={async () => {
                const newSprite = await addLayer(
                  updateImageDefinition,
                  "New Layer"
                );
                setItemSelected(newSprite);
              }}
            />,
            <ToolbarButton
              key="addFolder"
              icon="📁"
              label="+"
              size="small"
              onClick={async () => {
                const newFolder = await addFolder(
                  updateImageDefinition,
                  "New Folder"
                );
                setItemSelected(newFolder);
              }}
            />,
            <ToolbarButton
              key="remove"
              icon="🗑"
              size="small"
              disabled={!canDelete(layerSelected, imageDefinition)}
              label=""
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                updateImageDefinition((state) =>
                  removeItem(layerSelected, state)
                );
              }}
            />,
            <ToolbarButton
              key="moveUp"
              icon="⬆"
              size="small"
              disabled={!canMoveUp(layerSelected, imageDefinition)}
              label=""
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                updateImageDefinition((state) => moveUp(layerSelected, state));
              }}
            />,
            <ToolbarButton
              key="moveDown"
              icon="⬇"
              size="small"
              disabled={!canMoveDown(layerSelected, imageDefinition)}
              label=""
              onClick={() => {
                if (layerSelected === null) {
                  return;
                }
                updateImageDefinition((state) =>
                  moveDown(layerSelected, state)
                );
              }}
            />,
          ]}
          items={
            <ShapeList
              shapes={imageDefinition.shapes}
              layerSelected={layerSelected}
              setItemSelected={setItemSelected}
              onRename={(oldName, newName) => {
                const layerName = makeLayerName(
                  imageDefinition,
                  newName,
                  layerSelected ? layerSelected.name : null
                );
                updateImageDefinition((state) =>
                  renameLayer(state, oldName, layerName)
                );
                setLayerSelected({ name: layerName, type: "layer" });
              }}
            />
          }
        />
      }
      tools={[
        <ToolbarButton
          key="addPoints"
          icon="✏️"
          disabled={!layerSelected}
          active={mouseMode === MouseMode.Aim}
          label=""
          onClick={async () => {
            if (layerSelected === null) {
              return;
            }
            setMouseMode(MouseMode.Aim);
          }}
        />,
        <ToolbarButton
          key="move"
          icon="✋"
          active={mouseMode === MouseMode.Grab}
          label=""
          onClick={async () => {
            if (layerSelected === null) {
              return;
            }
            setMouseMode(MouseMode.Grab);
          }}
        />,
        <ToolbarSeperator key="sep1" />,
        <ToolbarButton
          key="delete"
          icon="🗑"
          label=""
          disabled={!activeCoord}
          onClick={async () => {
            if (activeCoord === null || layerSelected === null) {
              return;
            }
            updateImageDefinition((state) =>
              removePoint(state, layerSelected.name, activeCoord)
            );
            setActiveCoord(null);
          }}
        />,
      ]}
      main={
        <MouseControl
          mode={mouseMode}
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onWheel={mouseWheel}
        >
          <TextureMapCanvas
            image={texture}
            shapes={imageDefinition.shapes}
            zoom={zoom}
            panX={panX}
            panY={panY}
            activeLayer={layerSelected}
            activeCoord={activeCoord}
          />
        </MouseControl>
      }
    />
  );
};

export default Layers;
