import solution from './0448'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description find-all-number-disappeared-in-an-array
 * @see {@link https://leetcode-cn.com/problems/find-all-numbers-disappeared-in-an-array/}
 * Given an array nums of n integers where nums[i] is in the range [1, n],
 * return an array of all the integers in the range [1, n] that do not appear in nums.
 */
describe('leetCode [0448]', () => {
  it('should AC', () => {
    expect(solution([1, 1])).toStrictEqual([2])
    expect(solution([4, 3, 2, 7, 8, 2, 3, 1])).toStrictEqual([5, 6])
  })
})
