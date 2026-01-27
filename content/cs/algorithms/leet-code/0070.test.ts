import solution from './0070'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description climbing-stairs
 * @see {@link https://leetcode-cn.com/problems/climbing-stairs/}
 * Fibonacci sequence
 */
describe('leetCode [0070]', () => {
  it('should AC', () => {
    expect(solution(1)).toStrictEqual(1)
    expect(solution(2)).toStrictEqual(2)
    expect(solution(3)).toStrictEqual(3)
  })
})
