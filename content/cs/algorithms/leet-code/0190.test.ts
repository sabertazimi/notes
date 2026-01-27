import solution from './0190'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description reverse-bits
 * @see {@link https://leetcode-cn.com/problems/reverse-bits/}
 * Reverse bits of a given 32 bits unsigned integer.
 */
describe('leetCode [0190]', () => {
  it('should AC', () => {
    expect(solution(0b00000010100101000001111010011100)).toStrictEqual(
      964176192,
    )
    expect(solution(0b11111111111111111111111111111101)).toStrictEqual(
      3221225471,
    )
  })
})
