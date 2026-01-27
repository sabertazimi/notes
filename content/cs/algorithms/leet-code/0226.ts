import type { TreeNode } from './Tree'

export default function invertTree(
  root: TreeNode<number> | null,
): TreeNode<number> | null {
  if (root === null)
    return null

  const leftTree = root.left
  const rightTree = root.right
  root.left = invertTree(rightTree)
  root.right = invertTree(leftTree)
  return root
}
