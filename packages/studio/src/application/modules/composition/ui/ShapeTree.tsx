import type { MutationVector } from "@geppetto/types";

import { LayerTreeEnvironment } from "@/application/modules/layers/ui/LayerTreeEnvironment";
import { useFile } from "@/application/state/FileContext";
import useEvent from "@/application/state/hooks/useEvent";
import { useToolAction } from "@/application/state/hooks/useToolAction";
import { useUpdateMutationValues } from "@/application/state/ImageControlContext";
import {
  findParentId,
  isEmpty,
  type PlacementInfo,
} from "@/domain/animation/file2/hierarchy";
import {
  addMutation,
  type AddMutationDetails,
  iconMapping,
  mutationLabels,
} from "@/domain/animation/file2/mutation";
import { addFolder, removeShape } from "@/domain/animation/file2/shapes";
import type { AppSection } from "@/dtos/application.dto";
import { type UseState } from "@/dtos/application.dto";
import {
  EmptyTree,
  Icon,
  Menu,
  MenuItem,
  Paragraph,
  ToolBar,
  ToolButton,
  ToolSeparator,
  Tree,
} from "@/ui/components";

type ShapeTreeProps = {
  selectedItemsState: UseState<string[]>;
  focusedItemState: UseState<string | undefined>;
  editControlId?: string;
  onSectionChange?: (newSection: AppSection) => void;
};

export const ShapeTree: React.FC<ShapeTreeProps> = ({
  selectedItemsState,
  focusedItemState,
  editControlId,
  onSectionChange,
}) => {
  const [file, setFile] = useFile();
  const [selectedItems] = selectedItemsState;
  const activeMutation =
    (selectedItems.length === 1 && file.mutations[selectedItems[0]]) || null;
  const selectedEmptyFolder =
    selectedItems.length === 1 &&
    file.layerFolders[selectedItems[0]] &&
    (file.layerHierarchy[selectedItems[0]].children || []).length === 0;
  const updateMutationValues = useUpdateMutationValues();

  const addFolderAction = useToolAction(() => {
    let position: PlacementInfo | undefined = undefined;
    const targetId = selectedItems[0];
    const folder = file.layerFolders[targetId];
    const item = file.layers[targetId];
    if (selectedItems.length === 1 && folder) {
      position = { parent: targetId };
    }
    if (selectedItems.length === 1 && item) {
      const parentId = findParentId(file.layerHierarchy, targetId);
      if (parentId) {
        position = { after: targetId, parent: parentId };
      }
    }
    setFile(addFolder("New folder", position));
  });

  const removeItemAction = useToolAction(() => {
    const item = selectedItems[0];
    setFile(removeShape(item));
  });

  const addMutationHandler = useEvent(
    (e: { value?: MutationVector["type"] }) => {
      if (!e.value) return;
      const targetId = selectedItems[0];

      const mutationType: MutationVector["type"] = e.value;
      let position: PlacementInfo | undefined = undefined;
      const folder = file.layerFolders[targetId];
      const layer = file.layers[targetId];
      const mutation = file.mutations[targetId];
      if (selectedItems.length === 1 && (folder || layer)) {
        position = { parent: targetId };
      }
      if (selectedItems.length === 1 && mutation) {
        const parentId = findParentId(file.layerHierarchy, targetId);
        if (parentId) {
          position = { after: targetId, parent: parentId };
        }
      }
      if (!position) return;
      const name = mutationLabels[mutationType];
      const addDetails = {} as AddMutationDetails<typeof mutationType>;
      const updatedImage = addMutation(
        file,
        name,
        mutationType,
        {},
        position,
        addDetails
      );
      updateMutationValues((values) => ({
        ...values,
        [addDetails.id]: updatedImage.defaultFrame[addDetails.id],
      }));
      setFile(updatedImage);
    }
  );

  return (
    <LayerTreeEnvironment
      editControlId={editControlId}
      focusedItemState={focusedItemState}
      selectedItemsState={selectedItemsState}
      showMutations
      showVisibilityToggle
      treeId="composition"
    >
      <ToolBar size="small">
        <ToolButton
          disabled={selectedItems.length > 1}
          icon={<Icon>📁</Icon>}
          label="+"
          onClick={addFolderAction}
          onKeyDown={addFolderAction}
          tooltip="Add folder"
        />
        <Menu
          align="center"
          arrow
          direction="bottom"
          menuButton={({ open }) => (
            <ToolButton
              active={open}
              disabled={selectedItems.length !== 1}
              icon={<Icon>⚪️</Icon>}
              label="+"
              tooltip="Add mutation"
            />
          )}
          portal
          transition
        >
          {Object.keys(mutationLabels).map((key) => (
            <MenuItem key={key} onClick={addMutationHandler} value={key}>
              {iconMapping[key as MutationVector["type"]]}{" "}
              {mutationLabels[key as MutationVector["type"]]}
            </MenuItem>
          ))}
        </Menu>
        <ToolSeparator />
        <ToolButton
          disabled={!(activeMutation || selectedEmptyFolder)}
          icon={<Icon>🗑</Icon>}
          onClick={removeItemAction}
          onKeyDown={removeItemAction}
          tooltip="Remove item"
        />
      </ToolBar>
      {isEmpty(file.layerHierarchy) ? (
        <EmptyTree>
          <Paragraph>
            Start by adding a layer on the{" "}
            <ToolButton
              icon={<Icon>🧬</Icon>}
              label="Layers screen"
              onClick={() => onSectionChange && onSectionChange("layers")}
              size="small"
              standAlone
              tooltip="Go to layers screen"
            />
            .
          </Paragraph>
        </EmptyTree>
      ) : (
        <Tree treeId="composition" />
      )}
    </LayerTreeEnvironment>
  );
};
