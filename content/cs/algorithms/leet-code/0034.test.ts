import solution from './0034'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description find-first-and-last-position-of-element-in-sorted-array
 * @see {@link https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/}
 * Given an array of integers nums sorted in ascending order,
 * find the starting and ending position of a given target value.
 * If target is not found in the array, return [-1, -1].
 * You must write an algorithm with O(log n) runtime complexity.
 */
describe('leetCode [0034]', () => {
  it('should AC', () => {
    expect(solution([], 0)).toStrictEqual([-1, -1])
    expect(solution([5, 7, 7, 8, 8, 10], 6)).toStrictEqual([-1, -1])
    expect(solution([5, 7, 7, 8, 8, 10], 8)).toStrictEqual([3, 4])
  })
})
