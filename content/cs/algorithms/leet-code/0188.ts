export default function maxProfit(k: number, prices: number[]): number {
  if (prices.length < 2)
    return 0

  // DP[i][0][K]: in the end of i-th day, hold zero stock, already sell K times.
  // DP[i][1][K]: in the end of i-th day, hold one stock, already sell K times.
  // DP[i][0][K] = Math.max(DP[i - 1][0][K], DP[i - 1][1][K - 1] + prices[i]);
  // DP[i][1][K] = Math.max(DP[i - 1][1][K], DP[i - 1][0][K] - prices[i]);
  // transform to:
  // newDP0[K] = Math.max(oldDP0[K], oldDP1[K - 1] + prices[i]);
  // newDP1[K] = Math.max(oldDP1[K], oldDP0[K] - prices[i]);
  // solution is the max of DP[N][0][K].
  const dp0 = Array.from<number>({ length: k + 1 }).fill(0)
  const dp1 = Array.from<number>({ length: k + 1 }).fill(-prices[0])

  for (let i = 1; i < prices.length; i++) {
    for (let j = 0; j < k + 1; j++) {
      const newDp0 = j === 0 ? dp0[j] : Math.max(dp0[j], dp1[j - 1] + prices[i])
      const newDp1 = Math.max(dp1[j], dp0[j] - prices[i])
      dp0[j] = newDp0
      dp1[j] = newDp1
    }
  }

  return Math.max(0, dp0[k])
}
