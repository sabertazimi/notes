import { ListNode } from './List'

export default function mergeTwoLists(
  l1: ListNode<number> | null,
  l2: ListNode<number> | null,
): ListNode<number> | null {
  const head = new ListNode(0)
  let tail = head

  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      tail.next = l1
      l1 = l1.next
      tail = tail.next
    } else {
      tail.next = l2
      l2 = l2.next
      tail = tail.next
    }
  }

  tail.next = l1 !== null ? l1 : l2

  return head.next
}
