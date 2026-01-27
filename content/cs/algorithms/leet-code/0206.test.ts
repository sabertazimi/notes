import solution from './0206'
import { arrayToList } from './List'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description reverse linked list
 * @see {@link https://leetcode-cn.com/problems/reverse-linked-list/}
 * Given the head of a singly linked list, reverse the list, and return the reversed list.
 */
describe('leetCode [0206]', () => {
  it('should AC', () => {
    expect(solution(arrayToList([]))).toStrictEqual(arrayToList([]))
    expect(solution(arrayToList([1]))).toStrictEqual(arrayToList([1]))
    expect(solution(arrayToList([1, 2]))).toStrictEqual(arrayToList([2, 1]))
    expect(solution(arrayToList([1, 2, 3]))).toStrictEqual(
      arrayToList([3, 2, 1]),
    )
    expect(solution(arrayToList([1, 2, 3, 4, 5]))).toStrictEqual(
      arrayToList([5, 4, 3, 2, 1]),
    )
  })
})
