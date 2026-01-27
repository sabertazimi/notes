import solution from './0074'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description search-a-2d-matrix
 * @see {@link https://leetcode-cn.com/problems/search-a-2d-matrix/}
 * Write an efficient algorithm that searches for a value in an m x n matrix.
 * This matrix has the following properties:
 * Integers in each row are sorted from left to right.
 * The first integer of each row is greater than the last integer of the previous row.
 */
describe('leetCode [0074]', () => {
  it('should AC', () => {
    expect(
      solution(
        [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60],
        ],
        3,
      ),
    ).toStrictEqual(true)
    expect(
      solution(
        [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60],
        ],
        13,
      ),
    ).toStrictEqual(false)
  })
})
