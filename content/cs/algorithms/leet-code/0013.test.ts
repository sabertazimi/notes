import solution from './0013'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description roman-to-integer
 * @see {@link https://leetcode-cn.com/problems/roman-to-integer/}
 * Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
 */
describe('leetCode [0013]', () => {
  it('should AC', () => {
    expect(solution('III')).toStrictEqual(3)
    expect(solution('IV')).toStrictEqual(4)
    expect(solution('IX')).toStrictEqual(9)
    expect(solution('LVIII')).toStrictEqual(58)
    expect(solution('MCMXCIV')).toStrictEqual(1994)
  })
})
