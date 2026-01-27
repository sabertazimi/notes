import type { ListNode } from './List'

export default function reverseList(
  head: ListNode<number> | null,
): ListNode<number> | null {
  if (head === null || head.next === null)
    return head

  let prev: ListNode<number> | null = null
  let current: ListNode<number> | null = head

  while (current) {
    const next: ListNode<number> | null = current.next
    current.next = prev
    prev = current
    current = next
  }

  return prev
}
