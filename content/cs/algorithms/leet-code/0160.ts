import type { ListNode } from './List'

export default function getIntersectionNode(
  headA: ListNode<number> | null,
  headB: ListNode<number> | null,
): ListNode<number> | null {
  if (headA === null || headB === null)
    return null

  let p1: ListNode<number> | null = headA
  let p2: ListNode<number> | null = headB

  while (p1 !== null && p2 !== null && p1 !== p2) {
    p1 = p1.next
    p2 = p2.next

    if (p1 === p2)
      return p1
    if (p1 === null)
      p1 = headB
    if (p2 === null)
      p2 = headA
  }

  return p1
}
