import solution from './0242'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description valid-anagram
 * @see {@link https://leetcode-cn.com/problems/valid-anagram/}
 * Given two strings s and t,
 * return true if t is an anagram of s,
 * and false otherwise.
 */
describe('leetCode [0242]', () => {
  it('should AC', () => {
    expect(solution('rat', 'car')).toStrictEqual(false)
    expect(solution('anagram', 'nagaram')).toStrictEqual(true)
  })
})
