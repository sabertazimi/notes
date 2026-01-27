import type { TreeNode } from './Tree'

export default function minDepth(
  root: TreeNode<number> | null,
): number | undefined {
  if (root === null)
    return 0

  let depth = 1
  const queue = [root]

  while (queue.length > 0) {
    for (let i = 0, size = queue.length; i < size; i++) {
      const node = queue.shift() as TreeNode<number>
      if (node.left === null && node.right === null)
        return depth
      if (node.left)
        queue.push(node.left)
      if (node.right)
        queue.push(node.right)
    }

    depth++
  }
}
