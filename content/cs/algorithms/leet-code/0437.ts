import type { TreeNode } from './Tree'

export default function pathSum(
  root: TreeNode<number> | null,
  targetSum: number,
): number {
  if (root === null)
    return 0
  const dfs = (node: TreeNode<number> | null, sum: number): number => {
    if (node === null)
      return 0
    sum += node.val
    return (
      (sum === targetSum ? 1 : 0) + dfs(node.left, sum) + dfs(node.right, sum)
    )
  }
  return (
    dfs(root, 0)
    + pathSum(root.left, targetSum)
    + pathSum(root.right, targetSum)
  )
}
