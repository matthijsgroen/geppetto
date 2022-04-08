import { TreeNode } from "./types";

export const addFirst = <T extends string>(
  tree: TreeNode<T>[],
  newNode: TreeNode<T>
): TreeNode<T>[] => [newNode, ...tree];

export const addAfter = <T extends string>(
  tree: TreeNode<T>[],
  newNode: TreeNode<T>,
  after: TreeNode<T>["id"]
): TreeNode<T>[] =>
  tree.reduce<TreeNode<T>[]>((result, item) => {
    if (item.id === after) {
      return result.concat(item, newNode);
    }
    return result.concat(
      item.children ? addAfter(item.children, newNode, after) : item
    );
  }, []);
