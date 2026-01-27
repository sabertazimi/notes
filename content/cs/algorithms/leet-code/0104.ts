import type { TreeNode } from './Tree'

export default function maxDepth(root: TreeNode<number> | null): number {
  return root === null
    ? 0
    : Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
}
