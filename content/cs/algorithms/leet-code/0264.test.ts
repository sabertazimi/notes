import solution from './0264'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description ugly-number-ii
 * @see {@link https://leetcode-cn.com/problems/ugly-number-ii/}
 * An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5.
 * Given an integer n, return the nth ugly number.
 */
describe('leetCode [0264]', () => {
  it('should AC', () => {
    expect(solution(1)).toStrictEqual(1)
    expect(solution(10)).toStrictEqual(12)
  })
})
