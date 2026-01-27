import solution from './0136'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description single-number
 * @see {@link https://leetcode-cn.com/problems/single-number/}
 * Given a non-empty array of integers nums,
 * every element appears twice except for one.
 * Find that single one.
 * You must implement a solution with a linear runtime complexity
 * and use only constant extra space.
 */
describe('leetCode [0136]', () => {
  it('should AC', () => {
    expect(solution([1])).toStrictEqual(1)
    expect(solution([2, 2, 1])).toStrictEqual(1)
    expect(solution([4, 1, 2, 1, 2])).toStrictEqual(4)
  })
})
