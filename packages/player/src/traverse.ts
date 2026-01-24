import type { Hierarchy, TreeNode } from "./types";

/**
 * Visit all nodes in a hierarchy tree, calling the visitor function for each node.
 *
 * @param hierarchy - The hierarchy tree to traverse
 * @param layers - Record of layer definitions by ID
 * @param mutations - Record of mutation definitions by ID
 * @param visitor - Callback function receiving nodeId and array of parent IDs
 */
export const visitHierarchy = (
  hierarchy: Hierarchy<"layerFolder" | "layer" | "mutation">,
  visitor: (
    nodeId: string,
    node: TreeNode<"layerFolder" | "layer" | "mutation">,
    parentIds: string[]
  ) => void
): void => {
  const root = hierarchy["root"];
  if (!root || !root.children) return;

  const traverse = (nodeId: string, parentIds: string[]): void => {
    const node = hierarchy[nodeId];
    if (!node || node.type === "root") return;

    visitor(nodeId, node, parentIds);

    if (node.children) {
      for (const childId of node.children) {
        traverse(childId, [...parentIds, nodeId]);
      }
    }
  };

  for (const childId of root.children) {
    traverse(childId, []);
  }
};

/**
 * Extract the mutation chain for a given node by traversing up the hierarchy.
 * Returns an array of mutation IDs from root to the node.
 *
 * @param nodeId - The node to get the mutation chain for
 * @param hierarchy - The hierarchy tree
 * @returns Array of mutation IDs in the chain from root to node
 */
export const getMutationChain = (
  nodeId: string,
  hierarchy: Hierarchy<"layerFolder" | "layer" | "mutation">
): string[] => {
  const mutationChain: string[] = [];
  let currentId = nodeId;

  while (currentId && currentId !== "root") {
    const node = hierarchy[currentId];
    if (!node || node.type === "root") break;

    if (node.type === "mutation") {
      mutationChain.unshift(currentId);
    }

    currentId = node.parentId;
  }

  return mutationChain;
};

/**
 * Build a mapping of mutation ID to its parent mutation ID (or -1 if no parent).
 * This creates an array where index corresponds to mutation array position.
 *
 * @param mutationIds - Ordered array of mutation IDs
 * @param hierarchy - The hierarchy tree
 * @returns Int32Array where each index points to parent mutation index (-1 if none)
 */
export const buildMutationParentMap = (
  mutationIds: string[],
  hierarchy: Hierarchy<"layerFolder" | "layer" | "mutation">
): Int32Array => {
  const mutationIndexMap = new Map<string, number>(
    mutationIds.map((id, index) => [id, index])
  );

  const parentMap = new Int32Array(mutationIds.length);

  mutationIds.forEach((id, index) => {
    const node = hierarchy[id];
    if (!node || node.type === "root") {
      parentMap[index] = -1;
      return;
    }

    // Find the nearest parent that is a mutation
    let parentId = node.parentId;
    while (parentId && parentId !== "root") {
      const parentNode = hierarchy[parentId];
      if (!parentNode || parentNode.type === "root") break;

      if (parentNode.type === "mutation") {
        const parentIndex = mutationIndexMap.get(parentId);
        parentMap[index] = parentIndex !== undefined ? parentIndex : -1;
        return;
      }

      parentId = parentNode.parentId;
    }

    parentMap[index] = -1;
  });

  return parentMap;
};

/**
 * Get all mutation IDs from the hierarchy in depth-first order.
 *
 * @param hierarchy - The hierarchy tree
 * @returns Ordered array of mutation IDs
 */
export const getAllMutationIds = (
  hierarchy: Hierarchy<"layerFolder" | "layer" | "mutation">
): string[] => {
  const mutationIds: string[] = [];
  const root = hierarchy["root"];
  if (!root || !root.children) return mutationIds;

  const traverse = (nodeId: string): void => {
    const node = hierarchy[nodeId];
    if (!node || node.type === "root") return;

    if (node.type === "mutation") {
      mutationIds.push(nodeId);
    }

    if (node.children) {
      for (const childId of node.children) {
        traverse(childId);
      }
    }
  };

  for (const childId of root.children) {
    traverse(childId);
  }

  return mutationIds;
};

/**
 * Get all layer IDs from the hierarchy in depth-first order.
 *
 * @param hierarchy - The hierarchy tree
 * @returns Ordered array of layer IDs
 */
export const getAllLayerIds = (
  hierarchy: Hierarchy<"layerFolder" | "layer" | "mutation">
): string[] => {
  const layerIds: string[] = [];
  const root = hierarchy["root"];
  if (!root || !root.children) return layerIds;

  const traverse = (nodeId: string): void => {
    const node = hierarchy[nodeId];
    if (!node || node.type === "root") return;

    if (node.type === "layer") {
      layerIds.push(nodeId);
    }

    if (node.children) {
      for (const childId of node.children) {
        traverse(childId);
      }
    }
  };

  for (const childId of root.children) {
    traverse(childId);
  }

  return layerIds;
};

/**
 * Find the previous sibling of a specific type in the hierarchy.
 * Looks up the parent chain to find previous siblings of the given type.
 *
 * @param hierarchy - The hierarchy tree
 * @param type - The type to search for
 * @param startId - The node ID to start from
 * @returns The ID of the previous node of the given type, or null if not found
 */
export const getPreviousOfType = <T extends string>(
  hierarchy: Hierarchy<T>,
  type: T,
  startId: string
): string | null => {
  const nodeId = startId;
  let activeParent = hierarchy[nodeId];
  while (activeParent && activeParent.type !== "root") {
    if (activeParent.type === "root" || !("parentId" in activeParent)) break;
    activeParent = hierarchy[activeParent.parentId];
    if (!activeParent || activeParent.type === "root") {
      if (!activeParent || !activeParent.children) break;
    }

    let lastOfType: string | null = null;

    const children = activeParent.children || [];
    for (const childId of children) {
      if (childId === nodeId) break;
      if (hierarchy[childId].type === type) {
        lastOfType = childId;
      }
    }
    if (lastOfType) {
      return lastOfType;
    }
  }

  return null;
};
