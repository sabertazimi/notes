import solution from './0476'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description number-complement
 * @see {@link https://leetcode-cn.com/problems/number-complement/}
 * The complement of an integer is the integer you get when you flip all the 0's to 1's
 * and all the 1's to 0's in its binary representation.
 * For example, The integer 5 is "101" in binary and its complement is "010" which is the integer 2.
 * Given an integer num, return its complement.
 */
describe('leetCode [0476]', () => {
  it('should AC', () => {
    expect(solution(1)).toStrictEqual(0)
    expect(solution(2)).toStrictEqual(1)
    expect(solution(5)).toStrictEqual(2)
  })
})
