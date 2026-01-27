export default function missingNumber(nums: number[]): number {
  // index ^ nums[index]
  return nums.reduce((sum, num, index) => sum ^ num ^ index, 0) ^ nums.length
}
