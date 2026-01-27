import type { TreeNode } from './Tree'

export default function levelOrder(root: TreeNode<number> | null): number[][] {
  const res: number[][] = []

  if (root === null)
    return res

  const queue = [root]

  while (queue.length > 0) {
    const len = queue.length
    const row: number[] = []

    for (let i = 0; i < len; i++) {
      const node = queue.shift() as TreeNode<number>
      row.push(node.val)
      if (node.left !== null)
        queue.push(node.left)
      if (node.right !== null)
        queue.push(node.right)
    }

    res.push(row)
  }

  return res
}
