export default function maxProfit(prices: number[]): number {
  if (prices.length < 2)
    return 0

  let res = 0

  for (let i = 1, min = prices[0]; i < prices.length; i++) {
    min = Math.min(min, prices[i])
    res = Math.max(res, prices[i] - min)
  }

  return res
}
