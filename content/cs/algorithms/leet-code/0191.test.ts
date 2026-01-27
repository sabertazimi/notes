import solution from './0191'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description number-of-1-bits
 * @see {@link https://leetcode-cn.com/problems/number-of-1-bits/}
 * Write a function that takes an unsigned integer
 * and return the number of '1' bits it has (also known as the Hamming weight).
 */
describe('leetCode [0191]', () => {
  it('should AC', () => {
    expect(solution(0b00000000000000000000000000001011)).toStrictEqual(3)
    expect(solution(0b00000000000000000000000010000000)).toStrictEqual(1)
    expect(solution(0b11111111111111111111111111111101)).toStrictEqual(31)
  })
})
