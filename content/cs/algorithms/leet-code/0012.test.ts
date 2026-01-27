import solution from './0012'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description integer-to-roman
 * @see {@link https://leetcode-cn.com/problems/integer-to-roman/}
 * Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
 */
describe('leetCode [0012]', () => {
  it('should AC', () => {
    expect(solution(1)).toStrictEqual('I')
    expect(solution(2)).toStrictEqual('II')
    expect(solution(3)).toStrictEqual('III')
    expect(solution(4)).toStrictEqual('IV')
    expect(solution(5)).toStrictEqual('V')
    expect(solution(6)).toStrictEqual('VI')
    expect(solution(7)).toStrictEqual('VII')
    expect(solution(8)).toStrictEqual('VIII')
    expect(solution(9)).toStrictEqual('IX')
    expect(solution(10)).toStrictEqual('X')
    expect(solution(14)).toStrictEqual('XIV')
    expect(solution(38)).toStrictEqual('XXXVIII')
    expect(solution(58)).toStrictEqual('LVIII')
    expect(solution(444)).toStrictEqual('CDXLIV')
    expect(solution(600)).toStrictEqual('DC')
    expect(solution(999)).toStrictEqual('CMXCIX')
    expect(solution(1994)).toStrictEqual('MCMXCIV')
    expect(solution(3999)).toStrictEqual('MMMCMXCIX')
  })
})
