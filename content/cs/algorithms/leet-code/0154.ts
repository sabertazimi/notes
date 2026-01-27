export default function findMin(nums: number[]): number {
  if (nums.length < 2)
    return nums[0]
  if (nums.length === 2)
    return Math.min(nums[0], nums[1])

  let lo = 0
  let hi = nums.length - 1

  while (lo + 1 < hi) {
    if (nums[lo] < nums[hi])
      return nums[lo]
    const mid = lo + ((hi - lo) >> 1)
    if (nums[lo] < nums[mid])
      lo = mid
    else if (nums[lo] > nums[mid])
      hi = mid
    else lo++
  }

  return Math.min(nums[lo], nums[hi])
}
