import solution from './0541'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description reverse-string-ii
 * @see {@link https://leetcode-cn.com/problems/reverse-string-ii/}
 * Given a string s and an integer k,
 * reverse the first k characters for every 2k characters counting from the start of the string.
 * If there are fewer than k characters left, reverse all of them.
 * If there are less than 2k but greater than or equal to k characters,
 * then reverse the first k characters and left the other as original.
 */
describe('leetCode [0541]', () => {
  it('should AC', () => {
    expect(solution('a', 2)).toStrictEqual('a')
    expect(solution('abcd', 2)).toStrictEqual('bacd')
    expect(solution('abcdefg', 2)).toStrictEqual('bacdfeg')
    expect(solution('abcdefg', 8)).toStrictEqual('gfedcba')
    expect(
      solution(
        'hyzqyljrnigxvdtneasepfahmtyhlohwxmkqcdfehybknvdmfrfvtbsovjbdhevlfxpdaovjgunjqlimjkfnqcqnajmebeddqsgl',
        39,
      ),
    ).toStrictEqual(
      'fdcqkmxwholhytmhafpesaentdvxginrjlyqzyhehybknvdmfrfvtbsovjbdhevlfxpdaovjgunjqllgsqddebemjanqcqnfkjmi',
    )
  })
})
