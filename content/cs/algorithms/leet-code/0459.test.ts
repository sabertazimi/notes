import solution from './0459'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description repeat-substring-pattern
 * @see {@link https://leetcode-cn.com/problems/repeated-substring-pattern/}
 * Given a string s, check if it can be constructed by
 * taking a substring of it and appending multiple copies of the substring together.
 */
describe('leetCode [0459]', () => {
  it('should AC', () => {
    expect(solution('a')).toStrictEqual(false)
    expect(solution('ab')).toStrictEqual(false)
    expect(solution('aa')).toStrictEqual(true)
    expect(solution('aba')).toStrictEqual(false)
    expect(solution('abab')).toStrictEqual(true)
    expect(solution('ababba')).toStrictEqual(false)
    expect(solution('abaababaab')).toStrictEqual(true)
    expect(solution('abcabcabcabc')).toStrictEqual(true)
  })
})
