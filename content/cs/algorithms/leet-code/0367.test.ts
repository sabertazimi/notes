import solution from './0367'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description valid-perfect-square
 * @see {@link https://leetcode-cn.com/problems/valid-perfect-square/}
 * Given a positive integer num,
 * write a function which returns True if num is a perfect square else False.
 * Follow up: Do not use any built-in library function such as sqrt.
 */
describe('leetCode [0367]', () => {
  it('should AC', () => {
    expect(solution(14)).toStrictEqual(false)
    expect(solution(16)).toStrictEqual(true)
  })
})
