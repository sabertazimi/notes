export default function findPeakElement(nums: number[]): number | undefined {
  if (nums.length < 2)
    return 0

  let result = 0

  for (let lo = 0, hi = nums.length - 1; lo <= hi;) {
    const mid = lo + ((hi - lo) >> 1)
    if (
      (mid === 0 || nums[mid] >= nums[mid - 1])
      && (mid === nums.length - 1 || nums[mid] >= nums[mid + 1])
    ) {
      result = mid
      break
    } else if (mid > 0 && nums[mid - 1] > nums[mid]) {
      hi = mid - 1
    } else {
      lo = mid + 1
    }
  }

  return result
}
