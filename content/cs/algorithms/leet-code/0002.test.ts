import solution from './0002'
import { arrayToList } from './List'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description add-two-numbers
 * @see {@link https://leetcode-cn.com/problems/add-two-numbers/}
 * You are given two non-empty linked lists representing two non-negative integers.
 * The digits are stored in reverse order,
 * and each of their nodes contains a single digit.
 * Add the two numbers and return the sum as a linked list.
 * You may assume the two numbers do not contain any leading zero,
 * except the number 0 itself.
 */
describe('leetCode [0002]', () => {
  it('should AC', () => {
    expect(solution(arrayToList([]), arrayToList([]))).toStrictEqual(null)
    expect(solution(arrayToList([0]), arrayToList([0]))).toStrictEqual(
      arrayToList([0]),
    )
    expect(solution(arrayToList([1, 2]), arrayToList([]))).toStrictEqual(
      arrayToList([1, 2]),
    )
    expect(solution(arrayToList([]), arrayToList([2, 3]))).toStrictEqual(
      arrayToList([2, 3]),
    )
    expect(
      solution(arrayToList([2, 4, 3]), arrayToList([5, 6, 4])),
    ).toStrictEqual(arrayToList([7, 0, 8]))
    expect(
      solution(arrayToList([9, 9, 9, 9, 9, 9, 9]), arrayToList([9, 9, 9, 9])),
    ).toStrictEqual(arrayToList([8, 9, 9, 9, 0, 0, 0, 1]))
    expect(
      solution(arrayToList([9, 9, 9, 9]), arrayToList([9, 9, 9, 9, 9, 9, 9])),
    ).toStrictEqual(arrayToList([8, 9, 9, 9, 0, 0, 0, 1]))
  })
})
