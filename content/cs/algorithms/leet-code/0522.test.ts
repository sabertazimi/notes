import solution from './0522'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description longest-uncommon-subsequence-ii
 * @see {@link https://leetcode-cn.com/problems/longest-uncommon-subsequence-ii/}
 * Given an array of strings,
 * return the length of the longest uncommon subsequence between them.
 * If the longest uncommon subsequence does not exist, return -1.
 */
describe('leetCode [0522]', () => {
  it('should AC', () => {
    expect(solution(['aaa', 'aaa', 'aa'])).toStrictEqual(-1)
    expect(solution(['aba', 'cdc', 'eae'])).toStrictEqual(3)
    expect(solution(['aabbcc', 'aabbcc', 'cb', 'abc'])).toStrictEqual(2)
  })
})
