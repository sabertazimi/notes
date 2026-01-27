export default function searchRange(nums: number[], target: number): number[] {
  const ans = [-1, -1]

  if (nums.length === 0)
    return ans

  let lo = 0
  let hi = nums.length - 1

  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (nums[mid] >= target)
      hi = mid
    else lo = mid + 1
  }

  if (nums[hi] !== target)
    return ans
  ans[0] = hi

  lo = 0
  hi = nums.length - 1

  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (nums[mid] <= target)
      lo = mid
    else hi = mid - 1
  }

  ans[1] = hi

  return ans
}
