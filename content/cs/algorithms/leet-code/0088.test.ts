import solution from './0088'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description merge-sorted-array
 * @see {@link https://leetcode-cn.com/problems/merge-sorted-array/}
 * You are given two integer arrays nums1 and nums2,
 * sorted in non-decreasing order,
 * and two integers m and n,
 * representing the number of elements in nums1 and nums2 respectively.
 * Merge nums1 and nums2 into a single array sorted in non-decreasing order.
 * The final sorted array should not be returned by the function,
 * but instead be stored inside the array nums1.
 * To accommodate this, nums1 has a length of m + n,
 * where the first m elements denote the elements that should be merged,
 * and the last n elements are set to 0 and should be ignored.
 * nums2 has a length of n.
 */
describe('leetCode [0088]', () => {
  it('should AC', () => {
    expect(solution([1], 1, [], 0)).toStrictEqual([1])
    expect(solution([0], 0, [1], 1)).toStrictEqual([1])
    expect(solution([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3)).toStrictEqual([
      1,
      2,
      2,
      3,
      5,
      6,
    ])
  })
})
