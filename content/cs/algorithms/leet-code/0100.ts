import type { TreeNode } from './Tree'

export default function isSameTree<T>(
  p: TreeNode<T> | null,
  q: TreeNode<T> | null,
): boolean {
  if (p === null && q === null)
    return true
  if (p === null || q === null)
    return false
  return (
    p.val === q.val
    && isSameTree(p.left, q.left)
    && isSameTree(p.right, q.right)
  )
}
