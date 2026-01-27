import solution from './0220'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description contains-duplicate-iii
 * @see {@link https://leetcode-cn.com/problems/contains-duplicate-iii/}
 * Given an integer array nums and two integers k and t,
 * return true if there are two distinct indices i and j in the array
 * such that abs(nums[i] - nums[j]) <= t and abs(i - j) <= k.
 */
describe('leetCode [0220]', () => {
  it('should AC', () => {
    expect(solution([0], 0, 0)).toStrictEqual(false)
    expect(solution([1], 0, 1)).toStrictEqual(false)
    expect(solution([1], 1, 1)).toStrictEqual(false)
    expect(solution([1, 2, 1], 0, 1)).toStrictEqual(false)
    expect(solution([1, 2, 3, 1], 3, 0)).toStrictEqual(true)
    expect(solution([1, 0, 0, 1], 1, 0)).toStrictEqual(true)
    expect(solution([1, 0, 1, 1], 1, 2)).toStrictEqual(true)
    expect(solution([-1, 0, 1, 1], 1, 2)).toStrictEqual(true)
    expect(solution([1, 5, 9, 1, 5, 9], 2, 3)).toStrictEqual(false)
    expect(solution([1, 5, 9, 1, 5, 9], 2, 4)).toStrictEqual(true)
    expect(solution([8, 7, 15, 1, 6, 1, 9, 15], 1, 3)).toStrictEqual(true)
  })
})
