import type { ListNode } from './List'

export default function removeElements(
  head: ListNode<number> | null,
  val: number,
): ListNode<number> | null {
  while (head && head.val === val)
    head = head.next

  if (head === null)
    return null

  let prev = head
  let current = head.next

  while (current) {
    if (current.val === val)
      prev.next = current.next
    else prev = current
    current = current.next
  }

  return head
}
