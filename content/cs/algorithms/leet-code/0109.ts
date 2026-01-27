import type { ListNode } from './List'
import { TreeNode } from './Tree'

function getMiddle(left: ListNode<number>, right: ListNode<number> | null): ListNode<number> {
  let slow = left
  let fast = left

  while (fast !== right && fast.next !== right) {
    slow = slow.next as ListNode<number>
    fast = fast.next as ListNode<number>
    fast = fast.next as ListNode<number>
  }

  return slow
}

function listToBST(left: ListNode<number>, right: ListNode<number> | null): TreeNode<number> | null {
  if (left === right)
    return null
  const middle = getMiddle(left, right)
  const node = new TreeNode(middle.val)
  node.left = listToBST(left, middle)
  node.right = listToBST(middle.next as ListNode<number>, right)
  return node
}

export default function sortedListToBST(
  head: ListNode<number> | null,
): TreeNode<number> | null {
  if (head === null)
    return null
  return listToBST(head, null)
}
