import solution from './0021'
import { arrayToList } from './List'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description merge-two-sorted-lists
 * @see {@link https://leetcode-cn.com/problems/merge-two-sorted-lists/}
 * Merge two sorted linked lists and return it as a sorted list.
 * The list should be made by splicing together the nodes of the first two lists.
 */
describe('leetCode [0021]', () => {
  it('should AC', () => {
    expect(solution(arrayToList([]), arrayToList([]))).toStrictEqual(
      arrayToList([]),
    )
    expect(solution(arrayToList([]), arrayToList([0]))).toStrictEqual(
      arrayToList([0]),
    )
    expect(
      solution(arrayToList([1, 2, 4]), arrayToList([1, 3, 4])),
    ).toStrictEqual(arrayToList([1, 1, 2, 3, 4, 4]))
    expect(
      solution(arrayToList([1, 2, 4]), arrayToList([1, 3, 4, 5])),
    ).toStrictEqual(arrayToList([1, 1, 2, 3, 4, 4, 5]))
    expect(
      solution(arrayToList([1, 2, 4, 5]), arrayToList([1, 3, 4])),
    ).toStrictEqual(arrayToList([1, 1, 2, 3, 4, 4, 5]))
  })
})
