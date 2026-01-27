import solution from './0447'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description number-of-boomerangs
 * @see {@link https://leetcode-cn.com/problems/number-of-boomerangs/}
 * You are given n points in the plane that are all distinct,
 * where points[i] = [xi, yi].
 * A boomerang is a tuple of points (i, j, k)
 * such that the distance between i and j equals
 * the distance between i and k (the order of the tuple matters).
 * Return the number of boomerangs.
 */
describe('leetCode [0447]', () => {
  it('should AC', () => {
    expect(solution([[1, 1]])).toStrictEqual(0)
    expect(
      solution([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
    ).toStrictEqual(2)
    expect(
      solution([
        [1, 1],
        [2, 2],
        [3, 3],
      ]),
    ).toStrictEqual(2)
    expect(
      solution([
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]),
    ).toStrictEqual(20)
  })
})
