import solution from './0085'

/**
 * @author sabertazimi
 * @license MIT
 * @level hard
 * @description maximal-rectangle
 * @see {@link https://leetcode-cn.com/problems/maximal-rectangle/}
 * Given a rows x cols binary matrix filled with 0's and 1's,
 * find the largest rectangle containing only 1's and return its area.
 */
describe('leetCode [0085]', () => {
  it('should AC', () => {
    expect(solution([])).toStrictEqual(0)
    expect(solution([['0']])).toStrictEqual(0)
    expect(solution([['0', '0']])).toStrictEqual(0)
    expect(solution([['1']])).toStrictEqual(1)
    expect(solution([['1', '1']])).toStrictEqual(2)
    expect(
      solution([
        ['1', '0', '1', '0', '0'],
        ['1', '0', '1', '1', '1'],
        ['1', '1', '1', '1', '1'],
        ['1', '0', '0', '1', '0'],
      ]),
    ).toStrictEqual(6)
  })
})
