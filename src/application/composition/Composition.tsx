import { useState } from "react";
import { hasPoints } from "../../animation/file2/shapes";
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

export const Composition: React.FC<CompositionProps> = ({
  menu,
  textureState,
  zoomState,
  panXState,
  panYState,
  onSectionChange,
}) => {
  const texture = textureState[0];
  const [file, setFile] = useFile();

  const maxZoom = maxZoomFactor(texture);

  const [zoom] = zoomState;
  const [panX] = panXState;
  const [panY] = panYState;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
              minSize={200}
              defaultSize={300}
            >
              <ShapeTree
                selectedItemsState={[selectedItems, setSelectedItems]}
              />
            </ResizePanel>
            <Panel padding={5}>
              <Column>
                <ControlTree file={file} setFile={setFile} />

                <ItemEdit
                  selectedShapeIds={selectedItems}
                  selectedControlIds={[]}
                  file={file}
                  setFile={setFile}
                />
              </Column>
            </Panel>
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
                vectorValues={file.defaultFrame}
              />
            </LayerMouseControl>
          )}
        </Panel>
      </Row>
    </Column>
  );
};
