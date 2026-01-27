import solution from './0003'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description longest-substring-without-repeating-characters
 * @see {@link https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/}
 * Given a string `s`,
 * find the length of the longest substring without repeating characters.
 */
describe('leetCode [0003]', () => {
  it('should AC', () => {
    expect(solution('')).toStrictEqual(0)
    expect(solution('bbbbb')).toStrictEqual(1)
    expect(solution('abcabcbb')).toStrictEqual(3)
    expect(solution('pwwkew')).toStrictEqual(3)
  })
})
