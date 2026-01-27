export default function singleNumber(nums: number[]): number {
  return nums.reduce((a, b) => a ^ b)
}
