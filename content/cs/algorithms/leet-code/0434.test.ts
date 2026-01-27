import solution from './0434'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description number-of-segments-in-a-string
 * @see {@link https://leetcode-cn.com/problems/number-of-segments-in-a-string/}
 * You are given a string s, return the number of segments in the string.
 * A segment is defined to be a contiguous sequence of non-space characters.
 */
describe('leetCode [0434]', () => {
  it('should AC', () => {
    expect(solution('')).toStrictEqual(0)
    expect(solution('Hello')).toStrictEqual(1)
    expect(solution('love live! mu\'sic forever')).toStrictEqual(4)
    expect(solution('Hello, my name is John')).toStrictEqual(5)
  })
})
