import { ControlTreeEnvironment } from "@/application/modules/composition/ui/ControlTreeEnvironment";
import { useFile } from "@/application/state/FileContext";
import { useToolAction } from "@/application/state/hooks/useToolAction";
import {
  addControl,
  hasControls,
  removeControls,
} from "@/domain/animation/file2/controls";
import {
  findParentId,
  type PlacementInfo,
} from "@/domain/animation/file2/hierarchy";
import { hasMutations } from "@/domain/animation/file2/mutation";
import {
  EmptyTree,
  Icon,
  PanelTitle,
  Paragraph,
  ToolBar,
  ToolButton,
  ToolSeparator,
  Tree,
} from "@/ui/components";

type ControlTreeProps = {
  selectedControls: string[];
  onSelectControls?: (controlIds: string[]) => void;
};

export const ControlTree: React.FC<ControlTreeProps> = ({
  selectedControls,
  onSelectControls,
}) => {
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

  const doesHaveMutations = hasMutations(file);
  const doesHaveControls = hasControls(file);

  return (
    <ControlTreeEnvironment
      onSelectItems={onSelectControls}
      selectedItems={selectedControls}
      treeId="controls"
    >
      <PanelTitle>Controls</PanelTitle>
      <ToolBar size="small">
        <ToolButton
          disabled={!doesHaveMutations}
          icon={<Icon>⚙️</Icon>}
          label="+"
          onClick={addControlAction}
          onKeyDown={addControlAction}
          tooltip="Add control"
        />
        <ToolSeparator />
        <ToolButton
          disabled={selectedControls.length !== 1}
          icon={<Icon>🗑</Icon>}
          onClick={removeControlAction}
          onKeyDown={removeControlAction}
          tooltip="Remove control"
        />
      </ToolBar>
      {doesHaveMutations && doesHaveControls ? (
        <Tree treeId="controls" />
      ) : (
        <EmptyTree>
          {!doesHaveMutations && (
            <Paragraph selectable={false}>
              Add mutators to layers or folders to create controls.
            </Paragraph>
          )}
          {!doesHaveControls && doesHaveMutations && (
            <Paragraph selectable={false}>
              Add controls to manipulate mutators over time.
            </Paragraph>
          )}
        </EmptyTree>
      )}
    </ControlTreeEnvironment>
  );
};
