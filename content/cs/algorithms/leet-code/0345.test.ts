import solution from './0345'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description reverse-vowels-of-a-string
 * @see {@link https://leetcode-cn.com/problems/reverse-vowels-of-a-string/}
 * Given a string s, reverse only all the vowels in the string and return it.
 * The vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both cases.
 */
describe('leetCode [0345]', () => {
  it('should AC', () => {
    expect(solution('hello')).toStrictEqual('holle')
    expect(solution('leetcode')).toStrictEqual('leotcede')
  })
})
