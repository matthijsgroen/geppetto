import { Hierarchy, RootNode, TreeNode } from "./types";

export type PlacementInfo = { after?: string; parent?: string };

export const getNewId = (tree: Record<string, unknown>): string => {
  let id = 0;
  while (tree[id]) {
    id++;
  }
  return `${id}`;
};

const addFirst = <T extends string>(
  tree: Hierarchy<T>,
  newNode: Omit<TreeNode<T>, "parentId">,
  parentId: string | null
): [hierarchy: Hierarchy<T>, newId: string] => {
  const pId = parentId ? parentId : "root";
  const newId = getNewId(tree);
  return [
    {
      ...tree,
      [pId]: {
        ...tree[pId],
        children: [newId].concat(tree[pId].children ?? []),
      },
      [newId]: { ...newNode, parentId: pId },
    },
    newId,
  ];
};

export const addInHierarchy = <T extends string>(
  tree: Hierarchy<T>,
  newNode: Omit<TreeNode<T>, "parentId">,
  position: PlacementInfo = {}
): [hierarchy: Hierarchy<T>, newId: string] => {
  if (position.after) {
    const after = tree[position.after] as TreeNode<T>;
    if (after) {
      const parentId = after.parentId;
      const newId = getNewId(tree);
      const parent = tree[parentId];
      return [
        {
          ...tree,
          [parentId]: {
            ...parent,
            children: (parent.children || []).reduce<string[]>(
              (r, e) =>
                e === position.after ? r.concat(e, newId) : r.concat(e),
              []
            ),
          },
          [newId]: { ...newNode, parentId },
        },
        newId,
      ];
    }
  }
  if (position.parent) {
    const parentId = position.parent;
    const parent = tree[parentId];
    if (parent) {
      const newId = getNewId(tree);
      return [
        {
          ...tree,
          [parentId]: {
            ...parent,
            children: [newId].concat(parent.children || []),
          },
          [newId]: { ...newNode, parentId },
        },
        newId,
      ];
    }
  }
  return addFirst(tree, newNode, null);
};

export const isRootNode = <T extends string>(
  node: TreeNode<T> | RootNode
): node is RootNode => node.type === "root";

export const findInHierarchy = <T extends string>(
  tree: Hierarchy<T>,
  id: number | string
): TreeNode<T> | RootNode | undefined => tree[`${id}`];

export const findParentId = <T extends string>(
  tree: Hierarchy<T>,
  id: number | string
): string | null => {
  const item = findInHierarchy(tree, id);
  if (item === undefined) return null;
  if (!isRootNode(item)) return item.parentId;
  return null;
};
