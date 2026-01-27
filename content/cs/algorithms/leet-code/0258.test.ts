import solution from './0258'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description add-digits
 * @see {@link https://leetcode-cn.com/problems/add-digits/}
 * Given an integer num,
 * repeatedly add all its digits until the result has only one digit,
 * and return it.
 */
describe('leetCode [0258]', () => {
  it('should AC', () => {
    expect(solution(0)).toStrictEqual(0)
    expect(solution(9)).toStrictEqual(9)
    expect(solution(38)).toStrictEqual(2)
  })
})
