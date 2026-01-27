import solution from './0326'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description power-of-three
 * @see {@link https://leetcode-cn.com/problems/power-of-three/}
 * Given an integer n, return true if it is a power of three. Otherwise, return false.
 * An integer n is a power of three, if there exists an integer x such that n == 3x.
 */
describe('leetCode [0326]', () => {
  it('should AC', () => {
    expect(solution(0)).toStrictEqual(false)
    expect(solution(9)).toStrictEqual(true)
    expect(solution(27)).toStrictEqual(true)
    expect(solution(45)).toStrictEqual(false)
  })
})
