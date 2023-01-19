import {
  ControlledTreeEnvironment as ComplexControlledTreeEnvironment,
  ControlledTreeEnvironmentProps,
  TreeItem,
  InteractionManager,
} from "react-complex-tree";
import { TreeData } from "./Tree";

const getItemTitle = <T extends string>(item: TreeItem<TreeData<T>>): string =>
  item.data.name;

type Props<T extends string> = Omit<
  ControlledTreeEnvironmentProps<TreeData<T>>,
  "getItemTitle" | "treeId" | "defaultInteractionMode" | "keyboardBindings"
>;

const interactionManager: InteractionManager = {
  mode: "custom",
  createInteractiveElementProps: (item, treeId, actions, renderFlags) => ({
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
        if (!item.isFolder) {
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

export const TreeEnvironment = <T extends string>({
  children,
  ...props
}: Props<T>): ReturnType<React.FC<Props<T>>> => (
  <ComplexControlledTreeEnvironment
    {...props}
    getItemTitle={getItemTitle}
    defaultInteractionMode={interactionManager}
    keyboardBindings={{
      primaryAction: ["space"],
      renameItem: ["f2", "enter"],
    }}
  >
    {children}
  </ComplexControlledTreeEnvironment>
);
