export default function rotate(nums: number[], k: number): number[] {
  if (nums.length < 2 || k === 0)
    return nums
  const rotate = k % nums.length
  const rotatedNums = [
    ...nums.slice(nums.length - rotate),
    ...nums.slice(0, nums.length - rotate),
  ]
  nums.splice(0)
  nums.push(...rotatedNums)
  return nums
}
