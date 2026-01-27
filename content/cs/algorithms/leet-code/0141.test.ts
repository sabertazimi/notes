import solution from './0141'
import { arrayToList } from './List'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description linked-list-cycle
 * @see {@link https://leetcode-cn.com/problems/linked-list-cycle/}
 * Given head, the head of a linked list, determine if the linked list has a cycle in it.
 * There is a cycle in a linked list if there is some node in the list
 * that can be reached again by continuously following the next pointer.
 * Internally, pos is used to denote the index of the node that tail's next pointer is connected to.
 * Note that pos is not passed as a parameter.
 * Return true if there is a cycle in the linked list. Otherwise, return false.
 */
describe('leetCode [0141]', () => {
  it('should AC', () => {
    expect(solution(arrayToList([]))).toStrictEqual(false)
    expect(solution(arrayToList([1]))).toStrictEqual(false)
    expect(solution(arrayToList([1, 2, 3, 4, 5]))).toStrictEqual(false)

    const list1 = arrayToList([1, 2])
    if (list1?.next)
      list1.next.next = list1
    expect(solution(list1)).toStrictEqual(true)

    const list2 = arrayToList([3, 2, 0, -4])
    if (list2?.next?.next?.next)
      list2.next.next.next.next = list2.next
    expect(solution(list2)).toStrictEqual(true)
  })
})
