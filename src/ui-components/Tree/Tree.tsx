import {
  Tree as ComplexTree,
  TreeDataProvider as ComplexTreeDataProvider,
  TreeRenderProps,
} from "react-complex-tree";

import "react-complex-tree/lib/style.css";
import { GeppettoImage } from "src/animation/file2/types";
import { Icon } from "../";
import "./Tree.module.css";

export type TreeData = {
  name: string;
  icon: string;
  itemTools?: React.ReactChild;
};

export type TreeDataProvider = ComplexTreeDataProvider<TreeData> & {
  updateActiveTree?: (tree: GeppettoImage) => void;
};

const renderDepthOffset = 16;

const cx = (...classNames: Array<string | undefined | false>) =>
  classNames.filter((cn) => !!cn).join(" ");

const renderItem: TreeRenderProps<TreeData>["renderItem"] = ({
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
        item.hasChildren && "rct-tree-item-li-hasChildren",
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
          item.hasChildren && "rct-tree-item-title-container-hasChildren",
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
            item.hasChildren && "rct-tree-item-button-hasChildren",
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

export const Tree: React.VFC = () => (
  <ComplexTree
    treeId="tree-1"
    rootItem="root"
    treeLabel="Tree Example"
    renderItem={renderItem}
  />
);
