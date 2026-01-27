import { TreeNode } from './Tree'

export default function buildTree(
  inorder: number[],
  postorder: number[],
): TreeNode<number> | null {
  if (postorder.length === 0)
    return null

  const root = new TreeNode(postorder[postorder.length - 1])
  const postorderIndex = inorder.indexOf(postorder[postorder.length - 1])

  root.left = buildTree(
    inorder.slice(0, postorderIndex),
    postorder.slice(0, postorderIndex),
  )

  root.right = buildTree(
    inorder.slice(postorderIndex + 1),
    postorder.slice(postorderIndex, postorder.length - 1),
  )

  return root
}
