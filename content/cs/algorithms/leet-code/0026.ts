export default function removeDuplicates(nums: number[]): number {
  let pos = 0

  if (nums.length === 0)
    return pos

  for (let i = 1; i < nums.length; i++) {
    if (nums[pos] !== nums[i])
      nums[++pos] = nums[i]
  }

  return pos + 1
}
