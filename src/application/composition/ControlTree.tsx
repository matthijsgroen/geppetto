import { addControl, removeControls } from "../../animation/file2/controls";
import { findParentId, PlacementInfo } from "../../animation/file2/hierarchy";
import {
  Icon,
  Panel,
  Title,
  ToolBar,
  ToolButton,
  ToolSeparator,
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

  const removeControlAction = useToolAction(() => {
    setFile(removeControls(selectedControls));
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
            tooltip={"Add control"}
            label={"+"}
            onClick={addControlAction}
            onKeyDown={addControlAction}
          />
          <ToolSeparator />
          <ToolButton
            icon={<Icon>🗑</Icon>}
            tooltip={"Remove control"}
            onClick={removeControlAction}
            onKeyDown={removeControlAction}
            disabled={selectedControls.length !== 1}
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
