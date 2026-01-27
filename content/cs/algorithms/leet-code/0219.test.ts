import solution from './0219'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description contains-duplicate-ii
 * @see {@link https://leetcode-cn.com/problems/contains-duplicate-ii/}
 * Given an integer array nums and an integer k,
 * return true if there are two distinct indices i and j in the array
 * such that nums[i] == nums[j] and abs(i - j) <= k.
 */
describe('leetCode [0219]', () => {
  it('should AC', () => {
    expect(solution([1], 0)).toStrictEqual(false)
    expect(solution([1], 1)).toStrictEqual(false)
    expect(solution([1, 2, 1], 0)).toStrictEqual(false)
    expect(solution([1, 2, 3, 1], 3)).toStrictEqual(true)
    expect(solution([1, 0, 0, 1], 1)).toStrictEqual(true)
    expect(solution([1, 2, 3, 1, 2, 3], 2)).toStrictEqual(false)
  })
})
