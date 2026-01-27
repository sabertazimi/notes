import solution from './0371'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description sum-of-two-integers
 * @see {@link https://leetcode-cn.com/problems/sum-of-two-integers/}
 * Given two integers a and b,
 * return the sum of the two integers without using the operators + and -.
 */
describe('leetCode [0371]', () => {
  it('should AC', () => {
    expect(solution(1, 2)).toStrictEqual(3)
    expect(solution(2, 3)).toStrictEqual(5)
  })
})
