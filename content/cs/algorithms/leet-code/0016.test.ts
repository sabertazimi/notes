import solution from './0016'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description 3sum-closest
 * @see {@link https://leetcode-cn.com/problems/3sum-closest/}
 * Given an integer array nums of length n and an integer target,
 * find three integers in nums such that the sum is closest to target.
 * Return the sum of the three integers.
 * You may assume that each input would have exactly one solution.
 */
describe('leetCode [0016]', () => {
  it('should AC', () => {
    expect(solution([0, 0, 0], 1)).toStrictEqual(0)
    expect(solution([-1, 2, 1, -4], 1)).toStrictEqual(2)
    expect(solution([-1, 2, 1, -4], 2)).toStrictEqual(2)
    expect(solution([-1, 2, 1, -4, -3, -2], 0)).toStrictEqual(0)
    expect(solution([-1, 2, 1, -4, -3, -2, 2, 3], -1)).toStrictEqual(-1)
  })
})
