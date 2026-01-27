import solution from './0121'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description best-time-to-buy-and-sell-stock
 * @see {@link https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/}
 * You are given an array prices where prices[i]
 * is the price of a given stock on the ith day.
 * You want to maximize your profit by choosing a single day to buy one stock
 * and choosing a different day in the future to sell that stock.
 * Return the maximum profit you can achieve from this transaction.
 * If you cannot achieve any profit, return 0.
 */
describe('leetCode [0121]', () => {
  it('should AC', () => {
    expect(solution([1])).toStrictEqual(0)
    expect(solution([7, 6, 4, 3, 1])).toStrictEqual(0)
    expect(solution([7, 1, 5, 3, 6, 4])).toStrictEqual(5)
  })
})
