import type { ListNode } from './List'

export default function deleteDuplicates(
  head: ListNode<number> | null,
): ListNode<number> | null {
  for (let current = head; current !== null && current.next !== null;) {
    if (current.val === current.next.val)
      current.next = current.next.next
    else
      current = current.next
  }

  return head
}
