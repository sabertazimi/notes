import type { TreeNode } from './Tree'

export default function binaryTreePaths(
  root: TreeNode<number> | null,
): string[] {
  const paths: string[] = []

  const dfs = (root: TreeNode<number>, path: string) => {
    if (root.left === null && root.right === null) {
      paths.push(path)
      return
    }

    if (root.left)
      dfs(root.left, `${path}->${root.left.val.toString()}`)

    if (root.right)
      dfs(root.right, `${path}->${root.right.val.toString()}`)
  }

  if (root === null)
    return paths

  dfs(root, root.val.toString())
  return paths
}
