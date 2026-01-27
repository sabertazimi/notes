import solution from './0168'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description excel-sheet-column-title
 * @see {@link https://leetcode-cn.com/problems/excel-sheet-column-title/}
 * Given an integer columnNumber,
 * return its corresponding column title as it appears in an Excel sheet.
 */
describe('leetCode [0168]', () => {
  it('should AC', () => {
    expect(solution(1)).toStrictEqual('A')
    expect(solution(26)).toStrictEqual('Z')
    expect(solution(27)).toStrictEqual('AA')
    expect(solution(28)).toStrictEqual('AB')
    expect(solution(701)).toStrictEqual('ZY')
    expect(solution(475254)).toStrictEqual('ZZZZ')
    expect(solution(2147483647)).toStrictEqual('FXSHRXW')
  })
})
