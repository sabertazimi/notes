import type { ListNode } from './List'

export default function detectCycle(
  head: ListNode<number> | null,
): ListNode<number> | null {
  if (head === null || head.next === null)
    return null

  const set = new Set<ListNode<number>>()

  for (let node = head; node !== null; node = node.next as ListNode<number>) {
    if (set.has(node))
      return node
    set.add(node)
  }

  return null
}
