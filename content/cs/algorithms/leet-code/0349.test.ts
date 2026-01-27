import solution from './0349'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description intersection-of-two-arrays
 * @see {@link https://leetcode-cn.com/problems/intersection-of-two-arrays/}
 * Given two integer arrays nums1 and nums2,
 * return an array of their intersection.
 * Each element in the result must be unique
 * and you may return the result in any order.
 */
describe('leetCode [0349]', () => {
  it('should AC', () => {
    expect(solution([1, 2, 2, 1], [2, 2])).toStrictEqual([2])
    expect(solution([4, 9, 5], [9, 4, 9, 8, 4])).toStrictEqual([4, 9])
  })
})
