import {
  Tree as ComplexTree,
  TreeDataProvider as ComplexTreeDataProvider,
  TreeRenderProps,
} from "react-complex-tree";
import "react-complex-tree/lib/style.css";
import { GeppettoImage } from "../../animation/file2/types";
import { Icon } from "../";
import "./Tree.module.css";
export type { TreeItem, TreeItemIndex } from "react-complex-tree";

export type TreeData<Type extends string> = {
  name: string;
  type: Type;
  icon: string;
  itemTools?: React.ReactNode;
};

export type TreeDataProvider<Type extends string> = ComplexTreeDataProvider<
  TreeData<Type>
> & {
  updateActiveTree?: (tree: GeppettoImage) => void;
  addChangedId?: (...ids: string[]) => void;
};

const renderDepthOffset = 16;

const cx = (...classNames: Array<string | undefined | false>) =>
  classNames.filter((cn) => !!cn).join(" ");

const renderItem: TreeRenderProps<TreeData<string>>["renderItem"] = ({
  item,
  depth,
  children,
  title,
  context,
  arrow,
}) => {
  const InteractiveComponent = context.isRenaming ? "div" : "button";
  const type: "button" | undefined = context.isRenaming ? undefined : "button";
  // TODO have only root li component create all the classes
  return (
    <li
      {...context.itemContainerWithChildrenProps}
      className={cx(
        "rct-tree-item-li",
        item.isFolder && "rct-tree-item-li-isFolder",
        context.isSelected && "rct-tree-item-li-selected",
        context.isExpanded && "rct-tree-item-li-expanded",
        context.isFocused && "rct-tree-item-li-focused",
        context.isDraggingOver && "rct-tree-item-li-dragging-over",
        context.isSearchMatching && "rct-tree-item-li-search-match"
      )}
    >
      <div
        {...context.itemContainerWithoutChildrenProps}
        style={{ paddingLeft: `${depth * renderDepthOffset}px` }}
        className={cx(
          "rct-tree-item-title-container",
          item.isFolder && "rct-tree-item-title-container-hasChildren",
          context.isSelected && "rct-tree-item-title-container-selected",
          context.isExpanded && "rct-tree-item-title-container-expanded",
          context.isFocused && "rct-tree-item-title-container-focused",
          context.isDraggingOver &&
            "rct-tree-item-title-container-dragging-over",
          context.isSearchMatching &&
            "rct-tree-item-title-container-search-match"
        )}
      >
        {arrow}
        <Icon>{item.data.icon}</Icon>
        <InteractiveComponent
          {...context.interactiveElementProps}
          type={type}
          className={cx(
            "rct-tree-item-button",
            item.isFolder && "rct-tree-item-button-hasChildren",
            context.isSelected && "rct-tree-item-button-selected",
            context.isExpanded && "rct-tree-item-button-expanded",
            context.isFocused && "rct-tree-item-button-focused",
            context.isDraggingOver && "rct-tree-item-button-dragging-over",
            context.isSearchMatching && "rct-tree-item-button-search-match"
          )}
        >
          {title}
        </InteractiveComponent>
        {item.data.itemTools}
      </div>
      {children}
    </li>
  );
};

type TreeProps = {
  treeId: string;
};

export const TREE_ROOT = "root";
export const Tree: React.FC<TreeProps> = ({ treeId }) => (
  <ComplexTree
    treeId={treeId}
    rootItem={TREE_ROOT}
    treeLabel="Tree Example"
    renderItem={renderItem}
  />
);
