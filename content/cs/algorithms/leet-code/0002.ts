import { ListNode } from './List'

export default function addTwoNumbers(
  l1: ListNode<number> | null,
  l2: ListNode<number> | null,
): ListNode<number> | null {
  if (l1 === null && l2 === null)
    return null

  if (l1 === null)
    return l2

  if (l2 === null)
    return l1

  let c1: ListNode<number> | null = l1
  let c2: ListNode<number> | null = l2
  const head = new ListNode(0)
  let tail = head
  let sum = 0

  while (c1 !== null || c2 !== null) {
    // traverse longer list
    if (c1 !== null) {
      sum += c1.val
      c1 = c1.next
    }

    if (c2 !== null) {
      sum += c2.val
      c2 = c2.next
    }

    tail.next = new ListNode(sum % 10)
    sum = Math.floor(sum / 10)
    tail = tail.next
  }

  // Note that can have carry at the last digit
  if (sum === 1)
    tail.next = new ListNode(1)

  return head.next
}
