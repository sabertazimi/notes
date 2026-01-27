import solution from './0387'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description first-unique-character-in-a-string
 * @see {@link https://leetcode-cn.com/problems/first-unique-character-in-a-string/}
 * Given a string s,
 * find the first non-repeating character in it and return its index.
 * If it does not exist, return -1.
 */
describe('leetCode [0387]', () => {
  it('should AC', () => {
    expect(solution('aabb')).toStrictEqual(-1)
    expect(solution('leetcode')).toStrictEqual(0)
    expect(solution('LoveLeetcode')).toStrictEqual(2)
  })
})
