export default function maxSubArray(nums: number[]): number {
  let dp = nums[0]

  for (let i = 0, sum = 0; i < nums.length; i++) {
    // DP formula: f(i) = Math.max(f(i−1) + nums[i], nums[i])
    // Solution : Max(f(i)), 0 <= i <= nums.length - 1;
    sum = Math.max(sum + nums[i], nums[i])
    dp = Math.max(dp, sum)
  }

  return dp
}
