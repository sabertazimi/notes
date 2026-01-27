import solution from './0083'
import { arrayToList } from './List'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description remove-duplicates-from-sorted-list
 * @see {@link https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/}
 * Given the head of a sorted linked list,
 * delete all duplicates such that each element appears only once.
 * Return the linked list sorted as well.
 */
describe('leetCode [0083]', () => {
  it('should AC', () => {
    expect(solution(arrayToList([]))).toStrictEqual(arrayToList([]))
    expect(solution(arrayToList([1, 2]))).toStrictEqual(arrayToList([1, 2]))
    expect(solution(arrayToList([1, 1, 2]))).toStrictEqual(arrayToList([1, 2]))
    expect(solution(arrayToList([1, 1, 2, 3, 3]))).toStrictEqual(
      arrayToList([1, 2, 3]),
    )
  })
})
