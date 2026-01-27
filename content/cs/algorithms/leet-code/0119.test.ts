import solution from './0119'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description pascals-triangle-ii
 * @see {@link https://leetcode-cn.com/problems/pascals-triangle-ii/}
 * Given an integer rowIndex,
 * return the row Index (0-indexed) row of the Pascal's triangle.
 */
describe('leetCode [0119]', () => {
  it('should AC', () => {
    expect(solution(0)).toStrictEqual([1])
    expect(solution(1)).toStrictEqual([1, 1])
    expect(solution(3)).toStrictEqual([1, 3, 3, 1])
    expect(solution(4)).toStrictEqual([1, 4, 6, 4, 1])
  })
})
