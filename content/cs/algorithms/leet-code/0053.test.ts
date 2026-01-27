import solution from './0053'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description maximum-subarray
 * @see {@link https://leetcode-cn.com/problems/maximum-subarray/}
 * Given an integer array nums,
 * find the contiguous subarray (containing at least one number)
 * which has the largest sum and return its sum.
 * A subarray is a contiguous part of an array.
 */
describe('leetCode [0053]', () => {
  it('should AC', () => {
    expect(solution([1])).toStrictEqual(1)
    expect(solution([5, 4, -1, 7, 8])).toStrictEqual(23)
    expect(solution([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toStrictEqual(6)
  })
})
