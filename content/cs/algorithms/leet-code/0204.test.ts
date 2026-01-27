import solution from './0204'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description count-primes
 * @see {@link https://leetcode-cn.com/problems/count-primes/}
 * Count the number of prime numbers less than a non-negative number, n.
 */
describe('leetCode [0204]', () => {
  it('should AC', () => {
    expect(solution(0)).toStrictEqual(0)
    expect(solution(1)).toStrictEqual(0)
    expect(solution(10)).toStrictEqual(4)
  })
})
