import solution from './0342'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description power-of-four
 * @see {@link https://leetcode-cn.com/problems/power-of-four/}
 * Given an integer n, return true if it is a power of four. Otherwise, return false.
 * An integer n is a power of four, if there exists an integer x such that n == 4x.
 */
describe('leetCode [0342]', () => {
  it('should AC', () => {
    expect(solution(0)).toStrictEqual(false)
    expect(solution(1)).toStrictEqual(true)
    expect(solution(5)).toStrictEqual(false)
    expect(solution(16)).toStrictEqual(true)
  })
})
