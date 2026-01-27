import solution from './0547'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description number-of-provinces
 * @see {@link https://leetcode-cn.com/problems/number-of-provinces/}
 * There are n cities. Some of them are connected, while some are not.
 * If city a is connected directly with city b,
 * and city b is connected directly with city c,
 * then city a is connected indirectly with city c.
 * A province is a group of directly or indirectly connected cities
 * and no other cities outside of the group.
 * You are given an n x n matrix isConnected where isConnected[i][j] = 1
 * if the ith city and the jth city are directly connected,
 * and isConnected[i][j] = 0 otherwise.
 * Return the total number of provinces.
 */
describe('leetCode [0547]', () => {
  it('should AC', () => {
    expect(
      solution([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]),
    ).toStrictEqual(1)
    expect(
      solution([
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 1],
      ]),
    ).toStrictEqual(2)
    expect(
      solution([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]),
    ).toStrictEqual(3)
  })
})
