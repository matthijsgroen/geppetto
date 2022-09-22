import React from "react";
import {
  Column,
  Icon,
  Panel,
  Row,
  ToolBar,
  ToolSeparator,
  ToolSpacer,
  ToolTab,
} from "../../ui-components";
import { AppSection, UseState } from "../types";
import { InstallToolButton } from "../applicationMenu/InstallToolButton";
import { StartupScreen } from "../applicationMenu/Startup";
import { useFile } from "../contexts/FileContext";

type LayersProps = {
  onSectionChange?: (newSection: AppSection) => void;
  textureState: UseState<HTMLImageElement | null>;
  menu?: React.ReactChild;
};

export const Animation: React.FC<LayersProps> = ({
  textureState,
  onSectionChange,
  menu,
}) => {
  const texture = textureState[0];
  const [file] = useFile();

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
        <ToolTab
          icon={<Icon>🤷🏼</Icon>}
          label={"Composition"}
          onClick={() => onSectionChange && onSectionChange("composition")}
        />
        <ToolTab icon={<Icon>🏃</Icon>} label={"Animation"} active />
        <ToolSeparator />

        <ToolSpacer />
        <InstallToolButton />
      </ToolBar>
      <Row>
        <Panel workspace center>
          <StartupScreen file={file} texture={texture} screen={"animation"} />
        </Panel>
      </Row>
    </Column>
  );
};
