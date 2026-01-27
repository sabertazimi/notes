import solution from './0463'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description island-perimeter
 * @see {@link https://leetcode-cn.com/problems/island-perimeter/}
 * You are given row x col grid representing a map where grid[i][j] = 1
 * represents land and grid[i][j] = 0 represents water.
 * Grid cells are connected horizontally/vertically (not diagonally).
 * The grid is completely surrounded by water,
 * and there is exactly one island (i.e., one or more connected land cells).
 * The island doesn't have "lakes",
 * meaning the water inside isn't connected to the water around the island.
 * One cell is a square with side length 1.
 * The grid is rectangular, width and height don't exceed 100.
 * Determine the perimeter of the island.
 */
describe('leetCode [0463]', () => {
  it('should AC', () => {
    expect(solution([[1]])).toStrictEqual(4)
    expect(solution([[1, 0]])).toStrictEqual(4)
    expect(
      solution([
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
      ]),
    ).toStrictEqual(16)
  })
})
