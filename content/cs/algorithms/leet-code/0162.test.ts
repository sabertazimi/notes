import solution from './0162'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description find-peak-element
 * @see {@link https://leetcode-cn.com/problems/find-peak-element/}
 * A peak element is an element that is strictly greater than its neighbors.
 * Given an integer array nums, find a peak element, and return its index.
 * If the array contains multiple peaks, return the index to any of the peaks.
 * You may imagine that nums[-1] = nums[n] = -∞.
 * You must write an algorithm that runs in O(log n) time.
 */
describe('leetCode [0162]', () => {
  it('should AC', () => {
    expect(solution([1])).toStrictEqual(0)
    expect(solution([1, 2])).toStrictEqual(1)
    expect(solution([2, 1])).toStrictEqual(0)
    expect(solution([3, 2, 1])).toStrictEqual(0)
    expect(solution([1, 2, 3, 1])).toStrictEqual(2)
    expect(solution([1, 2, 1, 3, 5, 6, 4])).toStrictEqual(5)
  })
})
