import { TreeNode } from './Tree'

export default function buildTree(
  preorder: number[],
  inorder: number[],
): TreeNode<number> | null {
  if (preorder.length === 0)
    return null

  const root = new TreeNode(preorder[0])
  const preorderIndex = inorder.indexOf(preorder[0])

  root.left = buildTree(
    preorder.slice(1, preorderIndex + 1),
    inorder.slice(0, preorderIndex),
  )

  root.right = buildTree(
    preorder.slice(preorderIndex + 1),
    inorder.slice(preorderIndex + 1),
  )

  return root
}
