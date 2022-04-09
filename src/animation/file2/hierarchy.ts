import { TreeNode } from "./types";

export type PlacementInfo = { after?: string; parent?: string };

const addFirst = <T extends string>(
  tree: TreeNode<T>[],
  newNode: TreeNode<T>
): TreeNode<T>[] => [newNode, ...tree];

const addInHierarchyRec = <T extends string>(
  tree: TreeNode<T>[],
  newNode: TreeNode<T>,
  parent: TreeNode<T> | null,
  position: PlacementInfo
): TreeNode<T>[] =>
  tree.reduce<TreeNode<T>[]>((result, item) => {
    if (item.id === position.after) {
      return result.concat(item, newNode);
    }
    if (item.id === position.parent) {
      const parent = {
        ...item,
        children: addInHierarchyRec(
          item.children || [],
          newNode,
          item,
          position
        ),
      };
      const placed = parent.children.find((c) => c === newNode);
      if (!placed) {
        parent.children = addFirst(parent.children, newNode);
      }
      return result.concat(parent);
    }
    return result.concat(
      item.children
        ? addInHierarchyRec(item.children, newNode, parent, position)
        : item
    );
  }, []);

export const addInHierarchy = <T extends string>(
  tree: TreeNode<T>[],
  newNode: TreeNode<T>,
  position?: PlacementInfo
): TreeNode<T>[] =>
  position === undefined
    ? addFirst(tree, newNode)
    : addInHierarchyRec(tree, newNode, null, position);

export const findInHierarchy = <T extends string>(
  tree: TreeNode<T>[],
  id: number | string
): TreeNode<T> | undefined => {
  let result: TreeNode<T> | undefined = undefined;
  tree.find((v) => {
    if (v.id === id) {
      result = v;
      return true;
    }
    if (v.children) {
      const found = findInHierarchy(v.children, id);
      if (found) {
        result = found;
        return true;
      }
    }
  });
  return result;
};
