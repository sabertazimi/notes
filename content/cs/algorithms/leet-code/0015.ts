export default function threeSum(nums: number[]): number[][] {
  const solution: number[][] = []

  if (nums.length <= 2)
    return solution

  nums.sort((a, b) => a - b)

  for (let i = 0; i < nums.length - 2; i++) {
    // No answer when nums sorted
    if (nums[i] > 0)
      break

    let j = i + 1
    let k = nums.length - 1

    while (j < k) {
      const cur: number[] = []

      if (nums[i] + nums[j] + nums[k] === 0) {
        cur.push(nums[i], nums[j], nums[k])
        solution.push(cur)
        j++
        k--

        // Skip duplicated elements
        while (j < k && nums[j - 1] === nums[j])
          j++
        while (j < k && nums[k] === nums[k + 1])
          k--
      } else if (nums[i] + nums[j] + nums[k] < 0) {
        j++
      } else {
        k--
      }
    }

    // Skip duplicated elements
    while (i < nums.length - 2 && nums[i] === nums[i + 1])
      i++
  }

  return solution
}
