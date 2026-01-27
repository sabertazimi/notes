export default function findMaxConsecutiveOnes(nums: number[]): number {
  let max = 0
  let count = 0

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) {
      count++
    } else {
      max = Math.max(max, count)
      count = 0
    }
  }

  max = Math.max(max, count)
  return max
}
