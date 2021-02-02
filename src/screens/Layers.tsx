import React, { useState } from "react";
import TextureMapCanvas from "../animation/TextureMapCanvas";
import Menu from "../components/Menu";
import MouseControl, { MouseMode } from "../components/MouseControl";
import ShapeList from "../components/ShapeList";
import ToolbarButton from "../components/ToolbarButton";
import {
  addFolder,
  addLayer,
  canMoveDown,
  canMoveUp,
  moveDown,
  moveUp,
} from "../lib/definitionHelpers";
import { ImageDefinition } from "../lib/types";
import ScreenLayout from "../templates/ScreenLayout";

interface LayersProps {
  imageDefinition: ImageDefinition;
  texture: string;
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
  const [layerSelected, setLayerSelected] = useState<null | string>(null);

  const mouseMode = MouseMode.Grab;

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

  const mouseUp = () => {
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
              key="1"
              icon="📄"
              label="+"
              onClick={async () => {
                const newLayerName = await addLayer(
                  updateImageDefinition,
                  "New Layer"
                );
                setLayerSelected(newLayerName);
              }}
            />,
            <ToolbarButton
              key="2"
              icon="📁"
              label="+"
              onClick={async () => {
                const newLayerName = await addFolder(
                  updateImageDefinition,
                  "New Folder"
                );
                setLayerSelected(newLayerName);
              }}
            />,
            <ToolbarButton
              key="3"
              icon="⬆"
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
              key="4"
              icon="⬇"
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
              setLayerSelected={setLayerSelected}
            />
          }
        />
      }
      main={
        <MouseControl
          mode={mouseMode}
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onWheel={mouseWheel}
        >
          <TextureMapCanvas
            url={texture}
            shapes={imageDefinition.shapes}
            zoom={zoom}
            panX={panX}
            panY={panY}
            activeLayer={layerSelected}
          />
        </MouseControl>
      }
    />
  );
};

export default Layers;
