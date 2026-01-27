import solution from './0203'
import { arrayToList } from './List'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description remove-linked-list-elements
 * @see {@link https://leetcode-cn.com/problems/remove-linked-list-elements/}
 * Given the head of a linked list and an integer val,
 * remove all the nodes of the linked list that has Node.val == val,
 * and return the new head.
 */
describe('leetCode [0203]', () => {
  it('should AC', () => {
    expect(solution(arrayToList([]), 1)).toStrictEqual(arrayToList([]))
    expect(solution(arrayToList([7, 7, 7, 7]), 7)).toStrictEqual(
      arrayToList([]),
    )
    expect(solution(arrayToList([1, 2, 6, 3, 4, 5, 6]), 6)).toStrictEqual(
      arrayToList([1, 2, 3, 4, 5]),
    )
  })
})
