import solution from './0383'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description ransom-note
 * @see {@link https://leetcode-cn.com/problems/ransom-note/}
 * Given two stings ransomNote and magazine,
 * return true if ransomNote can be constructed from magazine and false otherwise.
 * Each letter in magazine can only be used once in ransomNote.
 */
describe('leetCode [0383]', () => {
  it('should AC', () => {
    expect(solution('a', 'b')).toStrictEqual(false)
    expect(solution('aa', 'ab')).toStrictEqual(false)
    expect(solution('aa', 'aab')).toStrictEqual(true)
  })
})
