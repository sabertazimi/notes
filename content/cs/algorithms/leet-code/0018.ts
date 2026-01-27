export default function fourSum(nums: number[], target: number): number[][] {
  const solution: number[][] = []

  if (nums.length <= 3)
    return solution

  nums.sort((a, b) => a - b)

  for (let i = 0; i < nums.length - 3; i++) {
    // Skip duplicated elements
    if (i > 0 && nums[i - 1] === nums[i])
      continue

    for (let j = i + 1; j < nums.length - 2; j++) {
      // Skip duplicated elements
      if (j > i + 1 && nums[j - 1] === nums[j])
        continue

      let k = j + 1
      let l = nums.length - 1

      while (k < l) {
        const sum = nums[i] + nums[j] + nums[k] + nums[l]

        if (sum === target) {
          const cur: number[] = []
          cur.push(nums[i], nums[j], nums[k], nums[l])
          solution.push(cur)
          k++
          l--

          // Skip duplicated elements
          while (k < l && nums[k - 1] === nums[k])
            k++

          while (k < l && nums[l] === nums[l + 1])
            l--
        } else if (sum < target) {
          k++
        } else {
          l--
        }
      }
    }
  }

  return solution
}
