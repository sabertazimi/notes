import solution from './0160'
import { arrayToList } from './List'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description intersection-of-two-linked-lists
 * @see {@link https://leetcode-cn.com/problems/intersection-of-two-linked-lists/}
 * Given the heads of two singly linked-lists headA and headB,
 * return the node at which the two lists intersect.
 * If the two linked lists have no intersection at all, return null.
 */
describe('leetCode [0160]', () => {
  it('should AC', () => {
    expect(solution(arrayToList([]), arrayToList([]))).toStrictEqual(
      arrayToList([]),
    )
    expect(solution(arrayToList([]), arrayToList([1]))).toStrictEqual(
      arrayToList([]),
    )
    expect(solution(arrayToList([1]), arrayToList([]))).toStrictEqual(
      arrayToList([]),
    )
    expect(solution(arrayToList([1]), arrayToList([2]))).toStrictEqual(
      arrayToList([]),
    )
    expect(solution(arrayToList([2, 6, 4]), arrayToList([1, 5]))).toStrictEqual(
      arrayToList([]),
    )

    const list = arrayToList([1])
    expect(solution(list, list)).toStrictEqual(arrayToList([1]))

    const list1 = arrayToList([1, 9, 1, 2, 4])
    const list2 = arrayToList([3])
    if (list1?.next?.next && list2)
      list2.next = list1.next.next.next
    expect(solution(list1, list2)).toStrictEqual(arrayToList([2, 4]))

    const list3 = arrayToList([4, 1, 8, 4, 5])
    const list4 = arrayToList([5, 6, 1])
    if (list3?.next && list4?.next?.next)
      list4.next.next.next = list3.next.next
    expect(solution(list3, list4)).toStrictEqual(arrayToList([8, 4, 5]))
  })
})
