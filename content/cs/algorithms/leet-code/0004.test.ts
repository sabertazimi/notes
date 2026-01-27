import solution from './0004'

/**
 * @author sabertazimi
 * @license MIT
 * @level hard
 * @description median-of-two-sorted-arrays
 * @see {@link https://leetcode-cn.com/problems/median-of-two-sorted-arrays/}
 * Given two sorted arrays nums1 and nums2 of size m and n respectively,
 * return the median of the two sorted arrays.
 * The overall run time complexity should be O(log (m+n)).
 */
describe('leetCode [0004]', () => {
  it('should AC', () => {
    expect(solution([], [1])).toStrictEqual(1)
    expect(solution([2], [])).toStrictEqual(2)
    expect(solution([0, 0], [0, 0])).toStrictEqual(0)
    expect(solution([1, 3], [2])).toStrictEqual(2)
    expect(solution([1, 2], [3, 4])).toStrictEqual(2.5)
  })
})
