import solution from './0441'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description arranging-coins
 * @see {@link https://leetcode-cn.com/problems/arranging-coins/}
 * You have n coins and you want to build a staircase with these coins.
 * The staircase consists of k rows where the ith row has exactly i coins.
 * The last row of the staircase may be incomplete.
 * Given the integer n, return the number of complete rows of the staircase you will build.
 */
describe('leetCode [0441]', () => {
  it('should AC', () => {
    expect(solution(5)).toStrictEqual(2)
    expect(solution(8)).toStrictEqual(3)
  })
})
