export default function containsNearbyAlmostDuplicate(
  nums: number[],
  k: number,
  t: number,
): boolean {
  if (nums.length < 2)
    return false

  const getBucket = (num: number, distance: number) => {
    return num < 0
      ? Math.floor((num + 1) / distance) - 1
      : Math.floor(num / distance)
  }

  for (let i = 0, map = new Map<number, number>(); i < nums.length; i++) {
    const num = nums[i]
    const bucket = getBucket(num, t + 1)

    if (map.has(bucket))
      return true
    if (
      map.has(bucket - 1)
      && Math.abs(num - (map.get(bucket - 1) as number)) <= t
    ) {
      return true
    }
    if (
      map.has(bucket + 1)
      && Math.abs(num - (map.get(bucket + 1) as number)) <= t
    ) {
      return true
    }

    // Every bucket has at most one element due to line 18.
    map.set(bucket, num)
    if (i >= k)
      map.delete(getBucket(nums[i - k], t + 1))
  }

  return false
}
