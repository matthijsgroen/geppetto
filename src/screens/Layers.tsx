import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Vec2InputControl from "src/components/Vec2InputControl";
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
  updatePoint,
} from "../lib/definitionHelpers";
import {
  ImageDefinition,
  ItemSelection,
  MutationVector,
  ShapeDefinition,
  Vec2,
} from "../lib/types";
import { getTextureCoordinate, maxZoomFactor } from "../lib/webgl";
import ScreenLayout from "../templates/ScreenLayout";

interface LayersProps {
  imageDefinition: ImageDefinition;
  texture: HTMLImageElement | null;
  updateImageDefinition: Dispatch<SetStateAction<ImageDefinition>>;
  showFPS?: boolean;
}

const Layers: React.VFC<LayersProps> = ({
  texture,
  imageDefinition,
  updateImageDefinition,
  showFPS,
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
  const shapeSelected = layerSelected
    ? getShape(imageDefinition, layerSelected.name)
    : null;

  useEffect(() => {
    if (shapeSelected === null || shapeSelected.type === "folder") {
      setMouseMode(MouseMode.Grab);
      setActiveCoord(null);
    }
  }, [shapeSelected]);

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
          const zf = maxZoomFactor(texture);

          return (
            dx > -zf / zoom &&
            dx < zf / zoom &&
            dy > -zf / zoom &&
            dy < zf / zoom
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
    const z = Math.min(
      maxZoomFactor(texture),
      Math.max(0.1, zoom - delta / 100)
    );
    setZoom(z);
  };

  return (
    <ScreenLayout
      menus={[
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
              icon="📄"
              size="small"
              disabled={!(shapeSelected && shapeSelected.type === "sprite")}
              label=""
              onClick={async () => {
                if (
                  shapeSelected === null ||
                  shapeSelected.type !== "sprite" ||
                  layerSelected === null
                ) {
                  return;
                }
                const newSprite = await addLayer(
                  updateImageDefinition,
                  layerSelected.name,
                  layerSelected.name,
                  {
                    points: ([] as Vec2[]).concat(shapeSelected.points),
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
                updateImageDefinition((state) =>
                  removeItem(state, layerSelected)
                );
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
                updateImageDefinition((state) =>
                  moveDown(state, layerSelected)
                );
              }}
            />,
          ]}
          items={
            <ShapeList
              shapes={imageDefinition.shapes}
              layerSelected={layerSelected}
              showPoints={true}
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
        />,
        <Menu
          title={"Point Info"}
          key="pointInfo"
          collapsable={true}
          size="minimal"
          items={
            activeCoord
              ? [
                  <Vec2InputControl
                    key={"editPoint"}
                    title={"Point"}
                    value={activeCoord}
                    onChange={(newValue) => {
                      if (layerSelected) {
                        updateImageDefinition((state) =>
                          updatePoint(
                            state,
                            layerSelected.name,
                            activeCoord,
                            newValue
                          )
                        );
                        setActiveCoord(newValue);
                      }
                    }}
                  />,
                ]
              : []
          }
        />,
      ]}
      tools={[
        <ToolbarButton
          key="move"
          hint="Move mode"
          icon="✋"
          active={mouseMode === MouseMode.Grab}
          label=""
          onClick={() => {
            setMouseMode(MouseMode.Grab);
          }}
        />,
        <ToolbarButton
          key="addPoints"
          hint="Add points mode"
          icon="✏️"
          disabled={!shapeSelected || shapeSelected.type === "folder"}
          active={mouseMode === MouseMode.Aim}
          label=""
          onClick={() => {
            setMouseMode(MouseMode.Aim);
          }}
        />,
        <ToolbarSeperator key="sep1" />,
        <ToolbarButton
          key="delete"
          hint="Remove selected point"
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
            showFPS={showFPS}
          />
        </MouseControl>
      }
    />
  );
};

export default Layers;
