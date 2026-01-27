import { TreeNode } from './Tree'

export default function sortedArrayToBST(
  nums: number[],
): TreeNode<number> | null {
  if (nums.length === 0)
    return null
  if (nums.length === 1)
    return new TreeNode(nums[0])
  const middle = nums.length >> 1
  const node = new TreeNode(nums[middle])
  node.left = sortedArrayToBST(nums.slice(0, middle))
  node.right = sortedArrayToBST(nums.slice(middle + 1))
  return node
}
