import solution from './0171'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description excel-sheet-column-number
 * @see {@link https://leetcode-cn.com/problems/excel-sheet-column-number/}
 * Given a string columnTitle that represents the column title as appear in an Excel sheet,
 * return its corresponding column number.
 */
describe('leetCode [0171]', () => {
  it('should AC', () => {
    expect(solution('A')).toStrictEqual(1)
    expect(solution('AB')).toStrictEqual(28)
    expect(solution('ZY')).toStrictEqual(701)
    expect(solution('FXSHRXW')).toStrictEqual(2147483647)
  })
})
