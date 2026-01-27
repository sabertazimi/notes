import solution from './0344'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description reverse-string
 * @see {@link https://leetcode-cn.com/problems/reverse-string/}
 * Write a function that reverses a string.
 * The input string is given as an array of characters s.
 */
describe('leetCode [0344]', () => {
  it('should AC', () => {
    expect(solution(['h', 'e', 'l', 'l', 'o'])).toStrictEqual([
      'o',
      'l',
      'l',
      'e',
      'h',
    ])
    expect(solution(['H', 'a', 'n', 'n', 'a', 'h'])).toStrictEqual([
      'h',
      'a',
      'n',
      'n',
      'a',
      'H',
    ])
  })
})
