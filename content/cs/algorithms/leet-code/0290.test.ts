import solution from './0290'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description word-pattern
 * @see {@link https://leetcode-cn.com/problems/word-pattern/}
 * Given a pattern and a string s,
 * find if s follows the same pattern.
 * Here follow means a full match,
 * such that there is a bijection between a letter in pattern and a non-empty word in s.
 */
describe('leetCode [0290]', () => {
  it('should AC', () => {
    expect(solution('aaaa', 'dog dog dog')).toStrictEqual(false)
    expect(solution('aaaa', 'dog cat cat dog')).toStrictEqual(false)
    expect(solution('abba', 'dog dog dog dog')).toStrictEqual(false)
    expect(solution('abba', 'dog cat cat fish')).toStrictEqual(false)
    expect(solution('abba', 'dog cat cat dog')).toStrictEqual(true)
  })
})
