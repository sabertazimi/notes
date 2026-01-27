import solution from './0231'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description power-of-two
 * @see {@link https://leetcode-cn.com/problems/power-of-two/}
 * Given an integer n, return true if it is a power of two. Otherwise, return false.
 * An integer n is a power of two, if there exists an integer x such that n == 2x.
 */
describe('leetCode [0231]', () => {
  it('should AC', () => {
    expect(solution(1)).toStrictEqual(true)
    expect(solution(3)).toStrictEqual(false)
    expect(solution(4)).toStrictEqual(true)
    expect(solution(5)).toStrictEqual(false)
    expect(solution(16)).toStrictEqual(true)
  })
})
