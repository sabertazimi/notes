import type { TreeNode } from './Tree'

export default function zigzagLevelOrder(
  root: TreeNode<number> | null,
): number[][] {
  const res: number[][] = []

  if (root === null)
    return res

  const queue = [root]
  let zigzag = true

  while (queue.length > 0) {
    const len = queue.length
    const row: number[] = []

    for (let i = 0; i < len; i++) {
      const node = queue.shift() as TreeNode<number>

      if (zigzag)
        row.push(node.val)
      else
        row.unshift(node.val)

      if (node.left !== null)
        queue.push(node.left)
      if (node.right !== null)
        queue.push(node.right)
    }

    zigzag = !zigzag
    res.push(row)
  }

  return res
}
