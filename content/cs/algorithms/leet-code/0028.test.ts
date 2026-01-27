import solution from './0028'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description implement strStr
 * @see {@link https://leetcode-cn.com/problems/implement-strstr/}
 * Return the index of the first occurrence of needle in haystack,
 * or -1 if needle is not part of haystack.
 */
describe('leetCode [0028]', () => {
  it('should AC', () => {
    expect(solution('', '')).toStrictEqual(0)
    expect(solution('aaaaa', 'bba')).toStrictEqual(-1)
    expect(solution('hello', 'll')).toStrictEqual(2)
  })
})
