import solution from './0198'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description house-robber
 * @see {@link https://leetcode-cn.com/problems/house-robber/}
 * You are a professional robber planning to rob houses along a street.
 * Each house has a certain amount of money stashed,
 * the only constraint stopping you from robbing each of them is
 * that adjacent houses have security systems connected
 * and it will automatically contact the police
 * if two adjacent houses were broken into on the same night.
 * Given an integer array nums representing the amount of money of each house,
 * return the maximum amount of money you can rob tonight without alerting the police.
 */
describe('leetCode [0198]', () => {
  it('should AC', () => {
    expect(solution([1])).toStrictEqual(1)
    expect(solution([3])).toStrictEqual(3)
    expect(solution([1, 2, 3, 1])).toStrictEqual(4)
    expect(solution([2, 7, 9, 3, 1])).toStrictEqual(12)
  })
})
