export default function thirdMax(nums: number[]): number {
  let max1 = Number.MIN_SAFE_INTEGER
  let max2 = Number.MIN_SAFE_INTEGER
  let max3 = Number.MIN_SAFE_INTEGER

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > max1) {
      max3 = max2
      max2 = max1
      max1 = nums[i]
    } else if (nums[i] > max2 && nums[i] < max1) {
      max3 = max2
      max2 = nums[i]
    } else if (nums[i] > max3 && nums[i] < max2) {
      max3 = nums[i]
    }
  }

  return max3 === Number.MIN_SAFE_INTEGER ? max1 : max3
}
