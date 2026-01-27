import type { TreeNode } from './Tree'

export default function pathSum(
  root: TreeNode<number> | null,
  targetSum: number,
): number[][] {
  const paths: number[][] = []

  const dfs = (
    node: TreeNode<number>,
    currSum: number,
    path: number[],
  ): void => {
    if (node.left === null && node.right === null && currSum === targetSum) {
      paths.push(path)
      return
    }

    if (node.left)
      dfs(node.left, currSum + node.left.val, path.concat(node.left.val))

    if (node.right)
      dfs(node.right, currSum + node.right.val, path.concat(node.right.val))
  }

  if (root === null)
    return paths
  dfs(root, root.val, [root.val])
  return paths
}
