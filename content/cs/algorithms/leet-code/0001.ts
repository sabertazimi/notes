export default function twoSum(nums: number[], target: number): number[] {
  if (nums.length <= 1)
    return []

  const indices = new Map<number, number>()
  const solution: number[] = []

  for (let i = 0; i < nums.length; i++) {
    const rest = target - nums[i]

    if (indices.has(rest)) {
      solution.push(indices.get(rest) as number)
      solution.push(i)
      return solution
    }

    indices.set(nums[i], i)
  }

  return solution
}
