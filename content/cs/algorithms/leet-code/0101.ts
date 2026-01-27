import type { TreeNode } from './Tree'

export default function isSymmetric<T>(root: TreeNode<T> | null): boolean {
  const dfs = (
    left: TreeNode<T> | null,
    right: TreeNode<T> | null,
  ): boolean => {
    if (left === null && right === null)
      return true
    if (left === null || right === null)
      return false
    if (left.val !== right.val)
      return false
    return dfs(left.left, right.right) && dfs(left.right, right.left)
  }

  if (root === null)
    return true
  return dfs(root.left, root.right)
}
