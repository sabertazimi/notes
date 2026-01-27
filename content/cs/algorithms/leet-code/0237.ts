import type { ListNode } from './List'

export default function deleteNode(root: ListNode<number>): ListNode<number> {
  const next = root.next as ListNode<number>
  root.val = next.val
  root.next = next.next
  return root
}
