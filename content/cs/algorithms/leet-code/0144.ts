import type { TreeNode } from './Tree'
import { traversal } from './Tree'

export default function preorderTraversal(
  root: TreeNode<number> | null,
): number[] {
  const res: number[] = []

  traversal(
    root,
    (node) => {
      res.push(node)
    },
    'pre',
  )

  return res
}
