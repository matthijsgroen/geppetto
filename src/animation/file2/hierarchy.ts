import { Hierarchy, RootNode, TreeNode } from "./types";

export type PlacementInfo =
  | { after: string }
  | { parent: string }
  | { before: string };

export const getNewId = (tree: Record<string, unknown>): string => {
  let id = 0;
  while (tree[id]) {
    id++;
  }
  return `${id}`;
};

const addFirst = <T extends string>(
  hierarchy: Hierarchy<T>,
  newNode: Omit<TreeNode<T>, "parentId">,
  parentId: string | null,
  itemId: string | null
): [hierarchy: Hierarchy<T>, newId: string] => {
  const pId = parentId ? parentId : "root";
  const newId = itemId === null ? getNewId(hierarchy) : itemId;
  return [
    {
      ...hierarchy,
      [pId]: {
        ...hierarchy[pId],
        children: [newId].concat(hierarchy[pId].children ?? []),
      },
      [newId]: { ...newNode, parentId: pId },
    },
    newId,
  ];
};

const moveNextInHierarchy = <T extends string>(
  hierarchy: Hierarchy<T>,
  itemId: string,
  item: Omit<TreeNode<T>, "parentId"> & { parentId?: string },
  targetId: string,
  adjacent: "before" | "after"
): Hierarchy<T> => {
  const target = hierarchy[targetId] as TreeNode<T>;
  if (!target) return hierarchy;

  const parentId = target.parentId;
  const parent = hierarchy[parentId];
  return {
    ...hierarchy,
    [parentId]: {
      ...parent,
      children: (parent.children || []).reduce<string[]>(
        (r, e) =>
          e === targetId
            ? adjacent === "after"
              ? r.concat(e, itemId)
              : r.concat(itemId, e)
            : r.concat(e),
        []
      ),
    },
    [itemId]: { ...item, parentId },
  };
};

export const addInHierarchyWithId = <T extends string>(
  hierarchy: Hierarchy<T>,
  newNode: Omit<TreeNode<T>, "parentId">,
  position: PlacementInfo | undefined,
  itemId: string | null
): [hierarchy: Hierarchy<T>, newId: string] => {
  const newId = itemId === null ? getNewId(hierarchy) : itemId;
  if (position && "after" in position) {
    const after = hierarchy[position.after] as TreeNode<T>;
    if (after) {
      return [
        moveNextInHierarchy(hierarchy, newId, newNode, position.after, "after"),
        newId,
      ];
    }
  }
  if (position && "before" in position) {
    const before = hierarchy[position.before] as TreeNode<T>;
    if (before) {
      return [
        moveNextInHierarchy(
          hierarchy,
          newId,
          newNode,
          position.before,
          "before"
        ),
        newId,
      ];
    }
  }
  if (position && "parent" in position) {
    const parentId = position.parent;
    const parent = hierarchy[parentId];
    if (parent) {
      return [
        {
          ...hierarchy,
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
  return addFirst(hierarchy, newNode, null, itemId);
};

export const addInHierarchy = <T extends string>(
  hierarchy: Hierarchy<T>,
  newNode: Omit<TreeNode<T>, "parentId">,
  position?: PlacementInfo
): [hierarchy: Hierarchy<T>, newId: string] =>
  addInHierarchyWithId(hierarchy, newNode, position, null);

export const isRootNode = <T extends string>(
  node: TreeNode<T> | RootNode
): node is RootNode => node.type === "root";

export const findInHierarchy = <T extends string>(
  hierarchy: Hierarchy<T>,
  id: string
): TreeNode<T> | RootNode | undefined => hierarchy[id];

export const findParentId = <T extends string>(
  hierarchy: Hierarchy<T>,
  id: string
): string | null => {
  const item = findInHierarchy(hierarchy, id);
  if (item === undefined) return null;
  if (!isRootNode(item)) return item.parentId;
  return null;
};

const collectChildIds = (
  hierarchy: Hierarchy<string>,
  parentId: string
): string[] => {
  const result: string[] = [];
  const item = findInHierarchy(hierarchy, parentId);
  if (item && item.children) {
    result.push(...item.children);
    for (const childId of item.children) {
      result.push(...collectChildIds(hierarchy, childId));
    }
  }
  return result;
};

const removeChildId = <T extends string>(
  hierarchy: Hierarchy<T>,
  itemId: string
): Hierarchy<T> => {
  const item = findInHierarchy(hierarchy, itemId);
  if (!item) return hierarchy;
  const updatedHierarchy = {
    ...hierarchy,
  };
  if (!isRootNode(item)) {
    const parent = hierarchy[item.parentId];
    const updatedChildren = (parent.children || []).filter(
      (id) => id !== itemId
    );
    const updatedParent: RootNode | TreeNode<T> = {
      ...parent,
      children: updatedChildren,
    };
    if (!isRootNode(updatedParent) && updatedChildren.length === 0) {
      delete updatedParent["children"];
    }
    updatedHierarchy[item.parentId] = updatedParent;
  }
  return updatedHierarchy;
};

export const removeFromHierarchy = <T extends string>(
  hierarchy: Hierarchy<T>,
  itemId: string
): [result: Hierarchy<T>, removedItems: Hierarchy<T>] => {
  const removedItems: Hierarchy<T> = {};
  const item = findInHierarchy(hierarchy, itemId);
  if (!item) return [hierarchy, removedItems];
  const affectedIds = [itemId, ...collectChildIds(hierarchy, itemId)];
  const updatedHierarchy = removeChildId(hierarchy, itemId);
  for (const id of affectedIds) {
    removedItems[id] = hierarchy[id];
    delete updatedHierarchy[id];
  }

  return [updatedHierarchy, removedItems];
};

const placementParentId = (
  hierarchy: Hierarchy<string>,
  placement: PlacementInfo
): string => {
  if ("parent" in placement) {
    return placement.parent;
  }
  const itemId = "before" in placement ? placement.before : placement.after;
  const item = hierarchy[itemId];
  if (isRootNode(item)) {
    return "root";
  }
  return item.parentId;
};

export const moveInHierarchy = <T extends string>(
  hierarchy: Hierarchy<T>,
  itemId: string,
  destination: PlacementInfo
): Hierarchy<T> => {
  const item = findInHierarchy(hierarchy, itemId);
  if (!item || isRootNode(item)) return hierarchy;
  const targetParentId = placementParentId(hierarchy, destination);
  const childIds = [itemId, ...collectChildIds(hierarchy, itemId)];
  if (childIds.includes(targetParentId)) return hierarchy;

  const updatedHierarchy = removeChildId(hierarchy, itemId);
  const [result] = addInHierarchyWithId(
    updatedHierarchy,
    item,
    destination,
    itemId
  );
  return result;
};

export const visualizeTree = <T extends string>(
  hierarchy: Hierarchy<T>,
  omitTypes: string[] = [],
  nodeId = "root",
  depth = 0
): string[] => {
  const result: string[] = [];
  const node = hierarchy[nodeId];
  if (omitTypes.includes(node.type)) return [];
  result.push(
    `${Array(depth * 2)
      .fill(" ")
      .join("")}${node.type}`
  );
  if (node.children) {
    for (const childId of node.children) {
      result.push(...visualizeTree(hierarchy, omitTypes, childId, depth + 1));
    }
  }

  return result;
};