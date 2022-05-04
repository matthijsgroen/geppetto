import {
  Icon,
  Panel,
  Title,
  ToolBar,
  ToolButton,
  Tree,
} from "../../ui-components";
import { ControlTreeEnvironment } from "../treeEnvironments/ControlTreeEnvironment";
import { UseState } from "../types";

type ControlTreeProps = {
  selectedItemsState: UseState<string[]>;
};

export const ControlTree: React.FC<ControlTreeProps> = ({
  selectedItemsState,
}) => {
  return (
    <ControlTreeEnvironment selectedItemsState={selectedItemsState}>
      <>
        <Title>Controls</Title>
        <ToolBar size="small">
          <ToolButton icon={<Icon>⚙️</Icon>} label={"+"} />
        </ToolBar>
        <Panel padding={5}>
          <Tree treeId="controls" />
        </Panel>
      </>
    </ControlTreeEnvironment>
  );
};
