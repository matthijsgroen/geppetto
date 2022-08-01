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
import { ControlEdit } from "./ControlEdit";

type ControlTreeProps = {
  selectedControlsState: UseState<string[]>;
  onEditControlSteps?: () => void;
};

export const ControlTree: React.FC<ControlTreeProps> = ({
  selectedControlsState,
  onEditControlSteps,
}) => {
  const [selectedControls] = selectedControlsState;

  return (
    <ControlTreeEnvironment
      selectedItemsState={selectedControlsState}
      treeId="controls"
    >
      <Panel padding={5}>
        <Title>Controls</Title>
        <ToolBar size="small">
          <ToolButton icon={<Icon>⚙️</Icon>} label={"+"} />
        </ToolBar>
        <Tree treeId="controls" />
        <ControlEdit
          selectedControlIds={selectedControls}
          onEditControlSteps={onEditControlSteps}
        />
      </Panel>
    </ControlTreeEnvironment>
  );
};
