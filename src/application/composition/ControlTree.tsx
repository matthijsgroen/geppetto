import { addControl, AddControlDetails } from "../../animation/file2/controls";
import { findParentId, PlacementInfo } from "../../animation/file2/hierarchy";
import {
  Icon,
  Panel,
  Title,
  ToolBar,
  ToolButton,
  Tree,
} from "../../ui-components";
import { useFile } from "../contexts/FileContext";
import { useToolAction } from "../hooks/useToolAction";
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
  const [file, setFile] = useFile();

  const addControlAction = useToolAction(() => {
    let position: PlacementInfo | undefined = undefined;
    const targetId = selectedControls[0];
    const folder = file.controlFolders[targetId];
    const item = file.controls[targetId];
    if (selectedControls.length === 1 && folder) {
      position = { parent: targetId };
    }
    if (selectedControls.length === 1 && item) {
      const parentId = findParentId(file.controlHierarchy, targetId);
      if (parentId) {
        position = { after: targetId, parent: parentId };
      }
    }
    setFile(addControl("New Control", position));
  });

  return (
    <ControlTreeEnvironment
      selectedItemsState={selectedControlsState}
      treeId="controls"
    >
      <Panel padding={5}>
        <Title>Controls</Title>
        <ToolBar size="small">
          <ToolButton
            icon={<Icon>⚙️</Icon>}
            label={"+"}
            onClick={addControlAction}
            onKeyDown={addControlAction}
          />
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
