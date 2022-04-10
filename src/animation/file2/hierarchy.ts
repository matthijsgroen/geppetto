import { TreeNode } from "./types";

export type PlacementInfo = { after?: string; parent?: string };

const addFirst = <T extends string>(
  tree: TreeNode<T>[],
  newNode: TreeNode<T>
): TreeNode<T>[] => [newNode, ...tree];

const addInHierarchyRec = <T extends string>(
  tree: TreeNode<T>[],
  newNode: TreeNode<T>,
  position: PlacementInfo
): TreeNode<T>[] =>
  tree.reduce<TreeNode<T>[]>((result, item) => {
    if (item.id === position.after) {
      return result.concat(item, newNode);
    }
    if (item.id === position.parent) {
      const parent = {
        ...item,
        children: addInHierarchyRec(item.children || [], newNode, position),
      };
      const placed = parent.children.find((c) => c === newNode);
      if (!placed) {
        parent.children = addFirst(parent.children, newNode);
      }
      return result.concat(parent);
    }
    return result.concat(
      item.children
        ? {
            ...item,
            children: addInHierarchyRec(item.children, newNode, position),
          }
        : item
    );
  }, []);

export const addInHierarchy = <T extends string>(
  tree: TreeNode<T>[],
  newNode: TreeNode<T>,
  position?: PlacementInfo
): TreeNode<T>[] => {
  if (position === undefined) {
    return addFirst(tree, newNode);
  }
  if (position.after) {
    const after = position.after;
    const element = tree.find((n) => (n.children || []).includes(after));
    console.log(element);
  }
  // : addInHierarchyRec(tree, newNode, position);
};

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

export const findParentId = <T extends string>(
  tree: TreeNode<T>[],
  id: number | string
): string | null => {
  let result: string | null = null;
  tree.find((v) => {
    if (v.children) {
      for (const child of v.children) {
        if (child.id === id) {
          result = v.id;
          return true;
        }
      }
      const parentId = findParentId(v.children, id);
      if (parentId !== null) {
        result = parentId;
        return true;
      }
    }
  });
  return result;
};
