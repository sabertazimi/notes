import solution from './0066'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description plus-one
 * @see {@link https://leetcode-cn.com/problems/plus-one/}
 * Given a non-empty array of decimal digits representing a non-negative integer,
 * increment one to the integer.
 * The digits are stored such that the most significant digit is at the head of the list,
 * and each element in the array contains a single digit.
 * You may assume the integer does not contain any leading zero,
 * except the number 0 itself.
 */
describe('leetCode [0066]', () => {
  it('should AC', () => {
    expect(solution([0])).toStrictEqual([1])
    expect(solution([1, 2, 3])).toStrictEqual([1, 2, 4])
    expect(solution([4, 3, 2, 1])).toStrictEqual([4, 3, 2, 2])
    expect(solution([9, 9, 9, 9])).toStrictEqual([1, 0, 0, 0, 0])
  })
})
