import type { TreeNode } from './Tree'

export default function sumOfLeftLeaves(root: TreeNode<number> | null): number {
  if (root === null)
    return 0
  if (root.left !== null && root.left.left === null && root.left.right === null)
    return root.left.val + sumOfLeftLeaves(root.right)
  return sumOfLeftLeaves(root.left) + sumOfLeftLeaves(root.right)
}
