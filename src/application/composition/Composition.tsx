import { GeppettoImage } from "../../animation/file2/types";
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
import { InstallToolButton } from "../applicationMenu/InstallToolButton";
import { AppSection, UseState } from "../types";

type CompositionProps = {
  zoomState: UseState<number>;
  panXState: UseState<number>;
  panYState: UseState<number>;
  fileState: UseState<GeppettoImage>;
  onSectionChange?: (newSection: AppSection) => void;
  textureState: UseState<HTMLImageElement | null>;
  menu?: React.ReactChild;
};

export const Composition: React.FC<CompositionProps> = ({
  menu,
  onSectionChange,
}) => {
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
          <Column></Column>
        </ResizePanel>
        <Panel workspace center>
          <p>No texture loaded</p>
        </Panel>
      </Row>
    </Column>
  );
};
