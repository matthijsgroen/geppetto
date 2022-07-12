import {
  findParentId,
  isEmpty,
  PlacementInfo,
} from "../../animation/file2/hierarchy";
import {
  addMutation,
  AddMutationDetails,
  iconMapping,
  mutationLabels,
} from "../../animation/file2/mutation";
import { addFolder, removeShape } from "../../animation/file2/shapes";
import { MutationVector } from "../../animation/file2/types";
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
} from "../../ui-components";
import { useFile } from "../applicationMenu/FileContext";
import { useUpdateMutationValues } from "../contexts/ImageControlContext";
import useEvent from "../hooks/useEvent";
import { useToolAction } from "../hooks/useToolAction";
import { LayerTreeEnvironment } from "../treeEnvironments/LayerTreeEnvironment";
import { UseState } from "../types";

type ShapeTreeProps = {
  selectedItemsState: UseState<string[]>;
  focusedItemState: UseState<string | undefined>;
  editControlId?: string;
};

export const ShapeTree: React.FC<ShapeTreeProps> = ({
  selectedItemsState,
  focusedItemState,
  editControlId,
}) => {
  const [file, setFile] = useFile();
  const [selectedItems, setSelectedItems] = selectedItemsState;
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
    const updatedImage = addFolder(file, "New folder", position);
    setFile(updatedImage);
  });

  const removeItemAction = useToolAction(() => {
    const item = selectedItems[0];
    setSelectedItems([]);
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
      selectedItemsState={selectedItemsState}
      focusedItemState={focusedItemState}
      showMutations
      toggleVisibility
      treeId="composition"
      editControlId={editControlId}
    >
      <ToolBar size="small">
        <ToolButton
          icon={<Icon>📁</Icon>}
          label="+"
          tooltip="Add folder"
          onClick={addFolderAction}
          onKeyDown={addFolderAction}
          disabled={selectedItems.length > 1}
        />
        <Menu
          portal
          menuButton={({ open }) => (
            <ToolButton
              icon={<Icon>⚪️</Icon>}
              label="+"
              tooltip="Add mutation"
              disabled={selectedItems.length !== 1}
              active={open}
            />
          )}
          direction="bottom"
          align="center"
          arrow
          transition
        >
          {Object.keys(mutationLabels).map((key) => (
            <MenuItem key={key} value={key} onClick={addMutationHandler}>
              {iconMapping[key as MutationVector["type"]]}{" "}
              {mutationLabels[key as MutationVector["type"]]}
            </MenuItem>
          ))}
        </Menu>
        <ToolSeparator />
        <ToolButton
          icon={<Icon>🗑</Icon>}
          disabled={!(activeMutation || selectedEmptyFolder)}
          onClick={removeItemAction}
          onKeyDown={removeItemAction}
          tooltip="Remove item"
        />
      </ToolBar>
      {isEmpty(file.layerHierarchy) ? (
        <EmptyTree>
          <Paragraph>Start by adding a layer on the "Layers" screen.</Paragraph>
        </EmptyTree>
      ) : (
        <Tree treeId="composition" />
      )}
    </LayerTreeEnvironment>
  );
};
