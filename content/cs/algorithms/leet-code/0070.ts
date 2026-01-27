export default function climbStairs(n: number): number {
  let dp = 1

  for (let i = 1, p = 0, q = 0; i <= n; ++i) {
    // dp[i] = dp[i - 2] + dp[i - 1]
    p = q
    q = dp
    dp = p + q
  }

  return dp
}
