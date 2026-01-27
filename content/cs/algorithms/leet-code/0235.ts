import type { TreeNode } from './Tree'

export default function lowestCommonAncestor(
  root: TreeNode<number>,
  p: TreeNode<number>,
  q: TreeNode<number>,
): TreeNode<number> | null {
  if (p.val < root.val && q.val < root.val)
    return lowestCommonAncestor(root.left as TreeNode<number>, p, q)
  if (p.val > root.val && q.val > root.val)
    return lowestCommonAncestor(root.right as TreeNode<number>, p, q)
  return root
}
