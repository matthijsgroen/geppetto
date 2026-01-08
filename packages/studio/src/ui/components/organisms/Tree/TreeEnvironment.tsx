import {
  ControlledTreeEnvironment as ComplexControlledTreeEnvironment,
  type ControlledTreeEnvironmentProps,
  type InteractionManager,
  type TreeItem,
} from "react-complex-tree";

import { type TreeData } from "./Tree";

const getItemTitle = <T extends string>(item: TreeItem<TreeData<T>>): string =>
  item.data.name;

type Props<T extends string> = Omit<
  ControlledTreeEnvironmentProps<TreeData<T>>,
  "getItemTitle" | "treeId" | "defaultInteractionMode" | "keyboardBindings"
>;

const interactionManager: InteractionManager = {
  mode: "custom",
  createInteractiveElementProps: (item, _treeId, actions, renderFlags) => ({
    onClick: (e) => {
      actions.focusItem();
      if (e.shiftKey) {
        actions.selectUpTo();
      } else if (e.ctrlKey) {
        if (renderFlags.isSelected) {
          actions.unselectItem();
        } else {
          actions.addToSelectedItems();
        }
      } else {
        actions.selectItem();
        if (!item.hasChildren) {
          actions.primaryAction();
        }
      }
    },
    onDoubleClick: () => {
      actions.focusItem();
      actions.selectItem();
      actions.startRenamingItem();
    },
    onFocus: () => {
      actions.focusItem();
    },
    onDragStart: (e) => {
      e.dataTransfer.dropEffect = "move"; // TODO
      // e.dataTransfer.setDragImage(environment.renderDraggingItem(viewState.selectedItems), 0, 0);
      actions.startDragging();
    },
    onDragOver: (e) => {
      e.preventDefault(); // Allow drop
    },
    draggable: renderFlags.canDrag && !renderFlags.isRenaming,
    tabIndex: !renderFlags.isRenaming
      ? renderFlags.isFocused
        ? 0
        : -1
      : undefined,
  }),
};

export function TreeEnvironment<T extends string>({
  children,
  ...props
}: Props<T>): ReturnType<React.FC<Props<T>>> {
  return (
    <ComplexControlledTreeEnvironment
      {...props}
      defaultInteractionMode={interactionManager}
      getItemTitle={getItemTitle}
      keyboardBindings={{
        primaryAction: ["space"],
        renameItem: ["f2", "enter"],
      }}
    >
      {children}
    </ComplexControlledTreeEnvironment>
  );
}
