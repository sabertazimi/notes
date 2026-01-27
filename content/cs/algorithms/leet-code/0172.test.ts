import solution from './0172'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description factorial-trailing-zeroes
 * @see {@link https://leetcode-cn.com/problems/factorial-trailing-zeroes/}
 * Given an integer n, return the number of trailing zeroes in n!.
 */
describe('leetCode [0172]', () => {
  it('should AC', () => {
    expect(solution(0)).toStrictEqual(0)
    expect(solution(3)).toStrictEqual(0)
    expect(solution(5)).toStrictEqual(1)
  })
})
