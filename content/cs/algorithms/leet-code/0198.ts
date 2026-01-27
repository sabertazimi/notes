export default function rob(nums: number[]): number {
  if (nums.length < 2)
    return nums[0]

  const res = [nums[0], Math.max(nums[0], nums[1])]

  for (let i = 2; i < nums.length; i++)
    res[i] = Math.max(res[i - 1], res[i - 2] + nums[i])

  return res[nums.length - 1]
}
