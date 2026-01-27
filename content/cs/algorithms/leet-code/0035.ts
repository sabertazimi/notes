export default function searchInsert(nums: number[], target: number): number {
  let lo = 0
  let hi = nums.length - 1

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1)
    if (nums[mid] === target)
      return mid
    else if (nums[mid] < target)
      lo = mid + 1
    else hi = mid - 1
  }

  return lo
}
