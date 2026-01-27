import solution from './0556'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description next-greater-element-iii
 * @see {@link https://leetcode-cn.com/problems/next-greater-element-iii/}
 * Given a positive integer n,
 * find the smallest integer
 * which has exactly the same digits existing in the integer n and is greater in value than n.
 * If no such positive integer exists, return -1.
 * Note that the returned integer should fit in 32-bit integer,
 * if there is a valid answer but it does not fit in 32-bit integer, return -1.
 */
describe('leetCode [0556]', () => {
  it('should AC', () => {
    expect(solution(21)).toStrictEqual(-1)
    expect(solution(12)).toStrictEqual(21)
    expect(solution(158476531)).toStrictEqual(158513467)
    expect(solution(2147483648)).toStrictEqual(-1)
  })
})
