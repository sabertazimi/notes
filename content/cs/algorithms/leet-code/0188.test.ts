import solution from './0188'

/**
 * @author sabertazimi
 * @license MIT
 * @level hard
 * @description best-time-to-buy-and-sell-stock-iv
 * @see {@link https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iv/}
 * You are given an integer array prices
 * where prices[i] is the price of a given stock on the ith day,
 * and an integer k.
 * Find the maximum profit you can achieve.
 * You may complete at most k transactions.
 */
describe('leetCode [0188]', () => {
  it('should AC', () => {
    expect(solution(1, [1])).toStrictEqual(0)
    expect(solution(2, [2, 4, 1])).toStrictEqual(2)
    expect(solution(2, [3, 2, 6, 5, 0, 3])).toStrictEqual(7)
  })
})
