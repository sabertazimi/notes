import solution from './0409'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description longest-palindrome
 * @see {@link https://leetcode-cn.com/problems/longest-palindrome/}
 * Given a string s which consists of lowercase or uppercase letters,
 * return the length of the longest palindrome that can be built with those letters.
 * Letters are case sensitive,
 * for example, "Aa" is not considered a palindrome here.
 */
describe('leetCode [0409]', () => {
  it('should AC', () => {
    expect(solution('a')).toStrictEqual(1)
    expect(solution('bb')).toStrictEqual(2)
    expect(solution('abccccdd')).toStrictEqual(7)
  })
})
