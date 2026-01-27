import solution from './0500'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description keyboard-row
 * @see {@link https://leetcode-cn.com/problems/keyboard-row/}
 * Given an array of strings words,
 * return the words that can be typed using letters of the alphabet
 * on only one row of American keyboard like the image below.
 * In the American keyboard:
 * the first row consists of the characters "qwertyuiop",
 * the second row consists of the characters "asdfghjkl",
 * and the third row consists of the characters "zxcvbnm".
 */
describe('leetCode [0500]', () => {
  it('should AC', () => {
    expect(solution(['omk'])).toStrictEqual([])
    expect(solution(['adsdf', 'sfd'])).toStrictEqual(['adsdf', 'sfd'])
    expect(solution(['zxc', 'Peace'])).toStrictEqual(['zxc'])
    expect(solution(['Hello', 'Alaska', 'Dad', 'Peace'])).toStrictEqual([
      'Alaska',
      'Dad',
    ])
  })
})
