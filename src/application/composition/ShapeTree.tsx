import { findParentId, PlacementInfo } from "../../animation/file2/hierarchy";
import {
  addMutation,
  iconMapping,
  removeMutation,
} from "../../animation/file2/mutation";
import { addFolder } from "../../animation/file2/shapes";
import { MutationVector } from "../../animation/file2/types";
import {
  Icon,
  Menu,
  MenuItem,
  ToolBar,
  ToolButton,
  ToolSeparator,
  Tree,
} from "../../ui-components";
import { useFile } from "../applicationMenu/FileContext";
import useEvent from "../hooks/useEvent";
import { useToolAction } from "../hooks/useToolAction";
import { LayerTreeEnvironment } from "../treeEnvironments/LayerTreeEnvironment";
import { UseState } from "../types";

type ShapeTreeProps = {
  selectedItemsState: UseState<string[]>;
  focusedItemState: UseState<string | undefined>;
};

const mutationLabels: Record<MutationVector["type"], string> = {
  translate: "Translate",
  deform: "Deform",
  rotate: "Rotate",
  stretch: "Stretch",
  opacity: "Opacity",
  colorize: "Colorize",
  lightness: "Lightness",
  saturation: "Saturation",
};

export const ShapeTree: React.FC<ShapeTreeProps> = ({
  selectedItemsState,
  focusedItemState,
}) => {
  const [file, setFile] = useFile();
  const [selectedItems, setSelectedItems] = selectedItemsState;

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
    const treeItem = file.layerHierarchy[item];
    if (treeItem.type === "mutation") {
      console.log("mutation", item);
      setSelectedItems([]);
      setFile((value) => removeMutation(value, item));
    }
    console.log(item);
    // setFileData((value) => removeShape(value, item));
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
      const [updatedImage] = addMutation(
        file,
        name,
        mutationType,
        {},
        position
      );
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
          disabled={selectedItems.length > 1}
          onClick={removeItemAction}
          onKeyDown={removeItemAction}
          tooltip="Remove item"
        />
      </ToolBar>
      <Tree treeId="composition" />
    </LayerTreeEnvironment>
  );
};
