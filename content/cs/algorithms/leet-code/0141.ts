import type { ListNode } from './List'

export default function hasCycle(head: ListNode<number> | null): boolean {
  if (head === null || head.next === null)
    return false

  // 龟兔赛跑
  for (
    let slow = head, fast = head.next;
    slow !== fast;
    slow = slow.next as ListNode<number>,
    fast = fast.next.next as ListNode<number>
  ) {
    if (fast === null || fast.next === null)
      return false
  }

  return true
}
