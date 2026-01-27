import solution from './0118'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description pascals-triangle
 * @see {@link https://leetcode-cn.com/problems/pascals-triangle/}
 * Given an integer numRows, return the first numRows of Pascal's triangle.
 * In Pascal's triangle,
 * each number is the sum of the two numbers directly above it as shown:
 */
describe('leetCode [0118]', () => {
  it('should AC', () => {
    expect(solution(1)).toStrictEqual([[1]])
    expect(solution(5)).toStrictEqual([
      [1],
      [1, 1],
      [1, 2, 1],
      [1, 3, 3, 1],
      [1, 4, 6, 4, 1],
    ])
  })
})
