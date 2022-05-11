import { useCallback, useEffect, useState } from "react";
import { hasPoints } from "../../animation/file2/shapes";
import { GeppettoImage } from "../../animation/file2/types";
import { Vec2 } from "../../types";
import {
  Column,
  Icon,
  Panel,
  ResizeDirection,
  ResizePanel,
  Row,
  Shortcut,
  ToolBar,
  ToolSeparator,
  ToolSpacer,
  ToolTab,
} from "../../ui-components";
import { ActionToolButton } from "../actions/ActionToolButton";
import { useFile } from "../applicationMenu/FileContext";
import { InstallToolButton } from "../applicationMenu/InstallToolButton";
import { StartupScreen } from "../applicationMenu/Startup";
import LayerMouseControl from "../canvas/LayerMouseControl";
import { MouseMode } from "../canvas/MouseControl";
import { useActionMap } from "../hooks/useActionMap";
import { AppSection, UseState } from "../types";
import CompositionCanvas from "../webgl/CompositionCanvas";
import { maxZoomFactor } from "../webgl/lib/canvas";
import { mergeMutationValue, mixHueVec2, mixVec2 } from "../webgl/lib/vertices";
import { ControlTree } from "./ControlTree";
import { ItemEdit } from "./ItemEdit";
import { ShapeTree } from "./ShapeTree";

type CompositionProps = {
  zoomState: UseState<number>;
  panXState: UseState<number>;
  panYState: UseState<number>;
  onSectionChange?: (newSection: AppSection) => void;
  textureState: UseState<HTMLImageElement | null>;
  menu?: React.ReactChild;
};

const calculateVectorValues = (file: GeppettoImage) => {
  const result: Record<string, Vec2> = { ...file.defaultFrame };
  for (const [controlId, controlValue] of Object.entries(file.controlValues)) {
    const controlInfo = file.controls[controlId];
    if (!controlInfo) continue;
    const minStep = Math.floor(controlValue);
    const maxStep = Math.ceil(controlValue);

    const minValue = controlInfo.steps[minStep];
    const maxValue = controlInfo.steps[maxStep];

    const mixValue = controlValue - minStep;

    for (const [mutationId, mutationValue] of Object.entries(minValue)) {
      const mutationInfo = file.mutations[mutationId];
      const value =
        mutationInfo.type === "colorize"
          ? mixHueVec2(mutationValue, maxValue[mutationId], mixValue)
          : mixVec2(mutationValue, maxValue[mutationId], mixValue);

      if (result[mutationId]) {
        result[mutationId] = mergeMutationValue(
          value,
          result[mutationId],
          mutationInfo.type
        );
      } else {
        result[mutationId] = value;
      }
    }
  }

  return result;
};

const TOGGLE_INFO_SHORTCUT: Shortcut = {
  ctrlOrCmd: true,
  key: "KeyI",
};

export const Composition: React.FC<CompositionProps> = ({
  menu,
  textureState,
  zoomState,
  panXState,
  panYState,
  onSectionChange,
}) => {
  const texture = textureState[0];
  const [file] = useFile();
  const [showItemDetails, setShowItemDetails] = useState(false);

  const maxZoom = maxZoomFactor(texture);

  const [zoom] = zoomState;
  const [panX] = panXState;
  const [panY] = panYState;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedControls, setSelectedControls] = useState<string[]>([]);

  const vectorValues = calculateVectorValues(file);

  const { actions, triggerKeyboardAction } = useActionMap(
    useCallback(
      () => ({
        toggleInfo: {
          icon: "ℹ",
          tooltip: "toggle info display",
          shortcut: TOGGLE_INFO_SHORTCUT,
          handler: () => {
            setShowItemDetails((prev) => !prev);
          },
        },
      }),
      [setShowItemDetails]
    )
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (triggerKeyboardAction(event)) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [triggerKeyboardAction, actions]);

  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolSeparator />
        <ToolTab
          icon={<Icon>🧬</Icon>}
          label={"Layers"}
          onClick={() => onSectionChange && onSectionChange("layers")}
        />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} active />
        <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} disabled />
        <ToolSpacer />
        <ActionToolButton
          action={actions.toggleInfo}
          active={showItemDetails}
        />
        <InstallToolButton />
      </ToolBar>
      <Row>
        <ResizePanel
          direction={ResizeDirection.East}
          defaultSize={250}
          minSize={150}
        >
          <Column>
            <ResizePanel
              direction={ResizeDirection.South}
              minSize={300}
              defaultSize={400}
            >
              <Panel padding={5}>
                <ShapeTree
                  selectedItemsState={[selectedItems, setSelectedItems]}
                />
              </Panel>
            </ResizePanel>
            <ControlTree
              selectedControlsState={[selectedControls, setSelectedControls]}
            />
          </Column>
        </ResizePanel>
        <Panel workspace center>
          <StartupScreen file={file} texture={texture} screen={"composition"} />
          {texture && hasPoints(file) && (
            <LayerMouseControl
              mode={MouseMode.Grab}
              maxZoomFactor={maxZoom}
              panXState={panXState}
              panYState={panYState}
              zoomState={zoomState}
            >
              <CompositionCanvas
                image={texture}
                activeLayers={selectedItems}
                file={file}
                zoom={zoom}
                panX={panX}
                panY={panY}
                vectorValues={vectorValues}
              />
            </LayerMouseControl>
          )}
        </Panel>
        {showItemDetails && (
          <ResizePanel
            direction={ResizeDirection.East}
            defaultSize={250}
            minSize={150}
          >
            <Column>
              <Panel padding={5}>
                <ItemEdit
                  selectedShapeIds={selectedItems}
                  selectedControlIds={[]}
                />
              </Panel>
            </Column>
          </ResizePanel>
        )}
      </Row>
    </Column>
  );
};
