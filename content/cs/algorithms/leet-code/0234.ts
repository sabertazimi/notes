import type { ListNode } from './List'

export default function isPalindrome(head: ListNode<number> | null): boolean {
  if (head === null || head.next === null)
    return true

  const nums: number[] = []

  for (
    let current = head;
    current !== null;
    current = current.next as ListNode<number>
  )
    nums.push(current.val)

  for (let i = 0, j = nums.length - 1; i < j; i++, j--) {
    if (nums[i] !== nums[j])
      return false
  }

  return true
}
