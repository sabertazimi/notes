export default function lengthOfLIS(nums: number[]): number {
  if (nums.length === 0)
    return 0

  const dp: number[] = Array.from({ length: nums.length })
  dp[0] = 1
  let LIS = 1

  for (let i = 1; i < nums.length; i++) {
    dp[i] = 1
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j])
        dp[i] = Math.max(dp[i], dp[j] + 1)
    }
    LIS = Math.max(LIS, dp[i])
  }

  return LIS
}
