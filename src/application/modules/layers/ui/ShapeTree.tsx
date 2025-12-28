import { useState } from "react";

import { LayerTreeEnvironment } from "@/application/modules/layers/ui/LayerTreeEnvironment";
import { useFile } from "@/application/state/FileContext";
import { useToolAction } from "@/application/state/hooks/useToolAction";
import {
  findParentId,
  isEmpty,
  type PlacementInfo,
} from "@/domain/animation/file2/hierarchy";
import {
  addFolder,
  addShape,
  removeShape,
} from "@/domain/animation/file2/shapes";
import { type UseState } from "@/dtos/application.dto";
import {
  EmptyTree,
  Icon,
  Panel,
  Paragraph,
  ToolBar,
  ToolButton,
  ToolSeparator,
  Tree,
} from "@/ui/components";

type ShapeTreeProps = {
  selectedItemsState: UseState<string[]>;
};

export const ShapeTree: React.FC<ShapeTreeProps> = ({ selectedItemsState }) => {
  const [file, setFile] = useFile();
  const [selectedItems] = selectedItemsState;
  const focusedItemState = useState<string | undefined>(undefined);

  const selectedEmptyFolder =
    selectedItems.length === 1 &&
    file.layerFolders[selectedItems[0]] &&
    (file.layerHierarchy[selectedItems[0]].children || []).length === 0;

  const selectedLayer =
    selectedItems.length === 1 && file.layers[selectedItems[0]];

  const addShapeAction = useToolAction(() => {
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
    setFile(addShape("New Shape", position));
  });

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

  return (
    <LayerTreeEnvironment
      focusedItemState={focusedItemState}
      selectedItemsState={selectedItemsState}
      treeId="layers"
    >
      <Panel padding="sm">
        <ToolBar size="small">
          <ToolButton
            disabled={selectedItems.length > 1}
            icon={<Icon>📄</Icon>}
            label="+"
            onClick={addShapeAction}
            onKeyDown={addShapeAction}
            tooltip="Add layer"
          />
          <ToolButton
            disabled={selectedItems.length > 1}
            icon={<Icon>📁</Icon>}
            label="+"
            onClick={addFolderAction}
            onKeyDown={addFolderAction}
            tooltip="Add folder"
          />
          <ToolSeparator />
          <ToolButton disabled icon={<Icon>📑</Icon>} tooltip="Copy layer" />
          <ToolButton
            disabled={!(selectedLayer || selectedEmptyFolder)}
            icon={<Icon>🗑</Icon>}
            onClick={removeItemAction}
            onKeyDown={removeItemAction}
            tooltip="Remove item"
          />
        </ToolBar>

        {isEmpty(file.layerHierarchy) ? (
          <EmptyTree>
            <Paragraph>Add a layer to start</Paragraph>
            <ToolButton
              disabled={selectedItems.length > 1}
              icon={<Icon>📄</Icon>}
              label="+"
              onClick={addShapeAction}
              onKeyDown={addShapeAction}
              standAlone
              tooltip="Add layer"
            />
          </EmptyTree>
        ) : (
          <Tree treeId="layers" />
        )}
      </Panel>
    </LayerTreeEnvironment>
  );
};
