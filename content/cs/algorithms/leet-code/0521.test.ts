import solution from './0521'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description longest-uncommon-subsequence-i
 * @see {@link https://leetcode-cn.com/problems/longest-uncommon-subsequence-i/}
 * Given two strings a and b,
 * return the length of the longest uncommon subsequence between a and b.
 * If the longest uncommon subsequence does not exist, return -1.
 * An uncommon subsequence between two strings is a string
 * that is a subsequence of one but not the other.
 * A subsequence of a string s is a string
 * that can be obtained after deleting any number of characters from s.
 * For example, "abc" is a subsequence of "aebdc"
 * because you can delete the underlined characters in "aebdc" to get "abc".
 * Other subsequences of "aebdc" include "aebdc", "aeb", and "" (empty string).
 */
describe('leetCode [0521]', () => {
  it('should AC', () => {
    expect(solution('aaa', 'aaa')).toStrictEqual(-1)
    expect(solution('aaa', 'bbb')).toStrictEqual(3)
    expect(solution('aba', 'cdc')).toStrictEqual(3)
  })
})
