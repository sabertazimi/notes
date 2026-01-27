import solution from './0234'
import { arrayToList } from './List'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description palindrome-linked-list
 * @see {@link https://leetcode-cn.com/problems/palindrome-linked-list/}
 * Given the head of a singly linked list,
 * return true if it is a palindrome.
 */
describe('leetCode [0234]', () => {
  it('should AC', () => {
    expect(solution(arrayToList([]))).toStrictEqual(true)
    expect(solution(arrayToList([1]))).toStrictEqual(true)
    expect(solution(arrayToList([1, 2]))).toStrictEqual(false)
    expect(solution(arrayToList([1, 2, 2, 1]))).toStrictEqual(true)
  })
})
