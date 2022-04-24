import { useContext } from "react";
import { GeppettoImage } from "../../animation/file2/types";
import {
  Column,
  Icon,
  Panel,
  ResizeDirection,
  ResizePanel,
  Row,
  ToolBar,
  ToolButton,
  ToolSpacer,
  ToolTab,
} from "../../ui-components";
import { ApplicationContext } from "../applicationMenu/ApplicationContext";
import { InstallToolButton } from "../applicationMenu/InstallToolButton";
import LayerMouseControl from "../canvas/LayerMouseControl";
import { MouseMode } from "../canvas/MouseControl";
import { AppSection, UseState } from "../types";
import CompositionCanvas from "../webgl/CompositionCanvas";
import { maxZoomFactor } from "../webgl/lib/canvas";

type CompositionProps = {
  zoomState: UseState<number>;
  panXState: UseState<number>;
  panYState: UseState<number>;
  fileState: UseState<GeppettoImage>;
  onSectionChange?: (newSection: AppSection) => void;
  textureState: UseState<HTMLImageElement | null>;
  menu?: React.ReactChild;
};

const hasPoints = (file: GeppettoImage) =>
  Object.values(file.layers).some((l) => l.points.length > 2);

export const Composition: React.FC<CompositionProps> = ({
  menu,
  textureState,
  fileState,
  zoomState,
  panXState,
  panYState,
  onSectionChange,
}) => {
  const texture = textureState[0];
  const [file] = fileState;

  const maxZoom = maxZoomFactor(texture);
  const { sendMessage } = useContext(ApplicationContext);

  const [zoom] = zoomState;
  const [panX] = panXState;
  const [panY] = panYState;

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
            <Panel />
          </Column>
        </ResizePanel>
        <Panel workspace center>
          {texture === null && (
            <p>
              No texture loaded{" "}
              <ToolButton
                icon={<Icon>🌅</Icon>}
                onClick={() => sendMessage("textureOpen")}
              />
            </p>
          )}
          {texture && !hasPoints(file) && (
            <p>No layers with a surface. Add a layer in the "Layers" screen.</p>
          )}
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
                file={file}
                zoom={zoom}
                panX={panX}
                panY={panY}
                vectorValues={{}}
              />
            </LayerMouseControl>
          )}
        </Panel>
      </Row>
    </Column>
  );
};
