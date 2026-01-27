import solution from './0205'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description isomorphic-strings
 * @see {@link https://leetcode-cn.com/problems/isomorphic-strings/}
 * Given two strings s and t, determine if they are isomorphic.
 * Two strings s and t are isomorphic
 * if the characters in s can be replaced to get t.
 * All occurrences of a character must be replaced with another character
 * while preserving the order of characters.
 * No two characters may map to the same character,
 * but a character may map to itself.
 */
describe('leetCode [0205]', () => {
  it('should AC', () => {
    expect(solution('a', 'a')).toStrictEqual(true)
    expect(solution('a', 'b')).toStrictEqual(true)
    expect(solution('ab', 'b')).toStrictEqual(false)
    expect(solution('foo', 'bar')).toStrictEqual(false)
    expect(solution('foo', 'bar')).toStrictEqual(false)
    expect(solution('egg', 'add')).toStrictEqual(true)
    expect(solution('badc', 'bada')).toStrictEqual(false)
    expect(solution('paper', 'title')).toStrictEqual(true)
    expect(solution('32767', '65535')).toStrictEqual(false)
  })
})
