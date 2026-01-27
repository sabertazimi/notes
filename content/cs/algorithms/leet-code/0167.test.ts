import solution from './0167'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description two-sum-ii-input-array-is-sorted
 * @see {@link https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/}
 * Given an array of integers numbers that is already sorted in non-decreasing order,
 * find two numbers such that they add up to a specific target number.
 * Return the indices of the two numbers (1-indexed) as an integer array answer of size 2,
 * where 1 <= answer[0] < answer[1] <= numbers.length.
 * The tests are generated such that there is exactly one solution.
 * You may not use the same element twice.
 */
describe('leetCode [0167]', () => {
  it('should AC', () => {
    expect(solution([-1, 0], -1)).toStrictEqual([1, 2])
    expect(solution([2, 4, 6], 11)).toStrictEqual([])
    expect(solution([2, 3, 4], 6)).toStrictEqual([1, 3])
    expect(solution([2, 7, 11, 15], 9)).toStrictEqual([1, 2])
    expect(solution([1, 2, 3, 4, 5, 6, 7, 8, 9], 5)).toStrictEqual([1, 4])
    expect(solution([1, 2, 3, 4, 5, 6, 7, 8, 9], 14)).toStrictEqual([5, 9])
  })
})
