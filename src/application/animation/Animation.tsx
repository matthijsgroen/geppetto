import React from "react";
import {
  Column,
  Control,
  ControlPanel,
  EmptyTree,
  Icon,
  Panel,
  Paragraph,
  ResizeDirection,
  ResizePanel,
  Row,
  TimeBox,
  TimeLineCurves,
  Title,
  ToolBar,
  ToolSeparator,
  ToolSpacer,
  ToolTab,
  TreeEnvironment,
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

      <ResizePanel
        direction={ResizeDirection.South}
        minSize={100}
        defaultSize={150}
      >
        <Row>
          <ResizePanel
            direction={ResizeDirection.East}
            minSize={100}
            defaultSize={175}
          >
            <Panel padding={5}>
              <TreeEnvironment items={{}} viewState={{}}>
                <EmptyTree>
                  <Paragraph>
                    Start by adding a layer on the "Layers" screen.
                  </Paragraph>
                </EmptyTree>
              </TreeEnvironment>
            </Panel>
          </ResizePanel>
          <Panel padding={5} workspace scrollable>
            <TimeLineCurves />
            <div>
              <TimeBox zoom={1.0}></TimeBox>
            </div>
          </Panel>
        </Row>
      </ResizePanel>
      <Row>
        <ResizePanel
          direction={ResizeDirection.East}
          minSize={100}
          defaultSize={225}
        >
          <Panel padding={5}>
            <TreeEnvironment items={{}} viewState={{}}>
              <EmptyTree>
                <Paragraph>
                  Start by adding a layer on the "Layers" screen.
                </Paragraph>
              </EmptyTree>
            </TreeEnvironment>
            <Title>Control value</Title>
            <ControlPanel>
              <Control label="Control 1">
                <input type="range" />
              </Control>
            </ControlPanel>
          </Panel>
        </ResizePanel>
        <Panel center workspace>
          <StartupScreen file={file} texture={texture} screen={"animation"} />
        </Panel>
      </Row>
    </Column>
  );
};
