import solution from './0020'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description valid-parentheses
 * @see {@link https://leetcode-cn.com/problems/valid-parentheses/}
 * Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
 * determine if the input string is valid.
 * An input string is valid if:
 * Open brackets must be closed by the same type of brackets.
 * Open brackets must be closed in the correct order.
 */
describe('leetCode [0020]', () => {
  it('should AC', () => {
    expect(solution('(')).toStrictEqual(false)
    expect(solution('()')).toStrictEqual(true)
    expect(solution('(]')).toStrictEqual(false)
    expect(solution('([)]')).toStrictEqual(false)
    expect(solution('{[]}')).toStrictEqual(true)
    expect(solution('()[]{}')).toStrictEqual(true)
  })
})
