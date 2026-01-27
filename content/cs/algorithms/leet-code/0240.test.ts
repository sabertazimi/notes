import solution from './0240'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description search-a-2d-matrix-ii
 * @see {@link https://leetcode-cn.com/problems/search-a-2d-matrix-ii/}
 * Write an efficient algorithm that searches for a target value in an m x n integer matrix.
 * The matrix has the following properties:
 * Integers in each row are sorted in ascending from left to right.
 * Integers in each column are sorted in ascending from top to bottom.
 */
describe('leetCode [0240]', () => {
  it('should AC', () => {
    expect(
      solution(
        [
          [1, 4, 7, 11, 15],
          [2, 5, 8, 12, 19],
          [3, 6, 9, 16, 22],
          [10, 13, 14, 17, 24],
          [18, 21, 23, 26, 30],
        ],
        5,
      ),
    ).toStrictEqual(true)
    expect(
      solution(
        [
          [1, 4, 7, 11, 15],
          [2, 5, 8, 12, 19],
          [3, 6, 9, 16, 22],
          [10, 13, 14, 17, 24],
          [18, 21, 23, 26, 30],
        ],
        20,
      ),
    ).toStrictEqual(false)
  })
})
