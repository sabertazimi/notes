import solution from './0461'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description hamming-distance
 * @see {@link https://leetcode-cn.com/problems/hamming-distance/}
 * The Hamming distance between two integers
 * is the number of positions at which the corresponding bits are different.
 * Given two integers x and y, return the Hamming distance between them.
 */
describe('leetCode [0461]', () => {
  it('should AC', () => {
    expect(solution(1, 4)).toStrictEqual(2)
    expect(solution(3, 1)).toStrictEqual(1)
  })
})
