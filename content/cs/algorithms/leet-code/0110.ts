import type { TreeNode } from './Tree'

export default function isBalanced(root: TreeNode<number> | null): boolean {
  const depth = (root: TreeNode<number> | null): number => {
    return root === null ? 0 : Math.max(depth(root.left), depth(root.right)) + 1
  }

  if (root === null)
    return true
  if (Math.abs(depth(root.left) - depth(root.right)) > 1)
    return false
  return isBalanced(root.left) && isBalanced(root.right)
}
