import solution from './0123'

/**
 * @author sabertazimi
 * @license MIT
 * @level hard
 * @description best-time-to-buy-and-sell-stock-iii
 * @see {@link https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/}
 * You are given an array prices where prices[i] is the price of a given stock on the ith day.
 * Find the maximum profit you can achieve.
 * You may complete at most two transactions.
 */
describe('leetCode [0123]', () => {
  it('should AC', () => {
    expect(solution([1])).toStrictEqual(0)
    expect(solution([7, 6, 4, 3, 1])).toStrictEqual(0)
    expect(solution([1, 2, 3, 4, 5])).toStrictEqual(4)
    expect(solution([3, 3, 5, 0, 0, 3, 1, 4])).toStrictEqual(6)
  })
})
