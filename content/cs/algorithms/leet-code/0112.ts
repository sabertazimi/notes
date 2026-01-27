import type { TreeNode } from './Tree'

export default function hasPathSum(
  root: TreeNode<number> | null,
  targetSum: number,
): boolean {
  const dfs = (
    node: TreeNode<number>,
    currSum: number,
  ): boolean | undefined => {
    if (node.left === null && node.right === null)
      return currSum === targetSum

    if (node.left) {
      const leftSum = currSum + node.left.val
      if (dfs(node.left, leftSum))
        return true
    }

    if (node.right) {
      const rightSum = currSum + node.right.val
      if (dfs(node.right, rightSum))
        return true
    }
  }

  if (root === null)
    return false
  return Boolean(dfs(root, root.val))
}
