import solution from './0263'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description ugly-number
 * @see {@link https://leetcode-cn.com/problems/ugly-number/}
 * An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5.
 * Given an integer n, return true if n is an ugly number.
 */
describe('leetCode [0263]', () => {
  it('should AC', () => {
    expect(solution(0)).toStrictEqual(false)
    expect(solution(1)).toStrictEqual(true)
    expect(solution(6)).toStrictEqual(true)
    expect(solution(8)).toStrictEqual(true)
    expect(solution(14)).toStrictEqual(false)
    expect(solution(25)).toStrictEqual(true)
  })
})
