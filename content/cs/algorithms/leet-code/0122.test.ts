import solution from './0122'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description best-time-to-buy-and-sell-stock-ii
 * @see {@link https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/}
 * You are given an array prices where prices[i] is the price of a given stock on the ith day.
 * Find the maximum profit you can achieve.
 * You may complete as many transactions as you like
 * (i.e., buy one and sell one share of the stock multiple times).
 */
describe('leetCode [0122]', () => {
  it('should AC', () => {
    expect(solution([1, 2, 3, 4, 5])).toStrictEqual(4)
    expect(solution([7, 6, 4, 3, 1])).toStrictEqual(0)
    expect(solution([7, 1, 5, 3, 6, 4])).toStrictEqual(7)
  })
})
