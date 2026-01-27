export default function moveZeroes(nums: number[]): number[] {
  nums.sort((a, b) => (a === 0 ? 1 : b === 0 ? -1 : 0))
  return nums
}
