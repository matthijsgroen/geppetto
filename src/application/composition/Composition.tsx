import { useState } from "react";
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
  ToolBar,
  ToolSpacer,
  ToolTab,
} from "../../ui-components";
import { useFile } from "../applicationMenu/FileContext";
import { InstallToolButton } from "../applicationMenu/InstallToolButton";
import { StartupScreen } from "../applicationMenu/Startup";
import LayerMouseControl from "../canvas/LayerMouseControl";
import { MouseMode } from "../canvas/MouseControl";
import { AppSection, UseState } from "../types";
import CompositionCanvas from "../webgl/CompositionCanvas";
import { maxZoomFactor } from "../webgl/lib/canvas";
import { mergeMutationValue, mixHueVec2, mixVec2 } from "../webgl/lib/vertices";
import { ControlTree } from "./ControlTree";
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

  const maxZoom = maxZoomFactor(texture);

  const [zoom] = zoomState;
  const [panX] = panXState;
  const [panY] = panYState;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedControls, setSelectedControls] = useState<string[]>([]);

  const vectorValues = calculateVectorValues(file);

  return (
    <Column>
      <ToolBar>
        {menu}
        <ToolTab
          icon={<Icon>🧬</Icon>}
          label={"Layers"}
          onClick={() => onSectionChange && onSectionChange("layers")}
        />
        <ToolTab icon={<Icon>🤷🏼</Icon>} label={"Composition"} active />
        <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} disabled />
        <ToolSpacer />
        <InstallToolButton />
      </ToolBar>
      <Row>
        <ResizePanel direction={ResizeDirection.East} defaultSize={250}>
          <Column>
            <ResizePanel
              direction={ResizeDirection.South}
              minSize={300}
              defaultSize={400}
            >
              <ShapeTree
                selectedItemsState={[selectedItems, setSelectedItems]}
              />
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
      </Row>
    </Column>
  );
};
