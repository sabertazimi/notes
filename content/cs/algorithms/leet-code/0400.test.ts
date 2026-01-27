import solution from './0400'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description nth-digit
 * @see {@link https://leetcode-cn.com/problems/nth-digit/}
 * Given an integer n,
 * return the nth digit of the infinite integer sequence
 * [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ...].
 */
describe('leetCode [0400]', () => {
  it('should AC', () => {
    expect(solution(3)).toStrictEqual(3)
    expect(solution(10)).toStrictEqual(1)
    expect(solution(11)).toStrictEqual(0)
    expect(solution(12)).toStrictEqual(1)
    expect(solution(13)).toStrictEqual(1)
  })
})
