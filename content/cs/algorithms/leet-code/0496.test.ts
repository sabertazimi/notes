import solution from './0496'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description next-greater-element-i
 * @see {@link https://leetcode-cn.com/problems/next-greater-element-i/}
 * The next greater element of some element x in an array
 * is the first greater element that is to the right of x in the same array.
 * You are given two distinct 0-indexed integer arrays nums1 and nums2,
 * where nums1 is a subset of nums2.
 * For each 0 <= i < nums1.length,
 * find the index j such that nums1[i] == nums2[j]
 * and determine the next greater element of nums2[j] in nums2.
 * If there is no next greater element,
 * then the answer for this query is -1.
 * Return an array ans of length nums1.length
 * such that ans[i] is the next greater element as described above.
 */
describe('leetCode [0496]', () => {
  it('should AC', () => {
    expect(solution([2, 4], [1, 2, 3, 4])).toStrictEqual([3, -1])
    expect(solution([4, 1, 2], [1, 3, 4, 2])).toStrictEqual([-1, 3, -1])
  })
})
