export default function containsNearbyDuplicate(
  nums: number[],
  k: number,
): boolean {
  for (let i = 0, set = new Set<number>(); i < nums.length; i++) {
    if (set.has(nums[i]))
      return true
    set.add(nums[i])
    if (set.size > k)
      set.delete(nums[i - k])
  }

  return false
}
