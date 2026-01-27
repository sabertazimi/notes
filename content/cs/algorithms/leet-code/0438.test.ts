import solution from './0438'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description find-all-anagrams-in-a-string
 * @see {@link https://leetcode-cn.com/problems/find-all-anagrams-in-a-string/}
 * Given two strings s and p,
 * return an array of all the start indices of p's anagrams in s.
 * You may return the answer in any order.
 * An Anagram is a word or phrase formed
 * by rearranging the letters of a different word or phrase,
 * typically using all the original letters exactly once.
 */
describe('leetCode [0438]', () => {
  it('should AC', () => {
    expect(solution('abab', 'ab')).toStrictEqual([0, 1, 2])
    expect(solution('abab', 'abb')).toStrictEqual([1])
    expect(solution('cbaebabacd', 'abc')).toStrictEqual([0, 6])
  })
})
