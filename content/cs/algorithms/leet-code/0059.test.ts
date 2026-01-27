import solution from './0059'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description spiral-matrix-ii
 * @see {@link https://leetcode-cn.com/problems/spiral-matrix-ii/}
 * Given a positive integer n,
 * generate an n x n matrix filled with elements from 1 to n2 in spiral order.
 */
describe('leetCode [0059]', () => {
  it('should AC', () => {
    expect(solution(1)).toStrictEqual([[1]])
    expect(solution(3)).toStrictEqual([
      [1, 2, 3],
      [8, 9, 4],
      [7, 6, 5],
    ])
  })
})
