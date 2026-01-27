import { MAX_INT } from './utils'

export default function threeSumClosest(
  nums: number[],
  target: number,
): number {
  let solution = 0
  let distance = MAX_INT

  nums.sort((a, b) => a - b)

  for (let i = 0; i < nums.length - 2; i++) {
    let j = i + 1
    let k = nums.length - 1

    while (j < k) {
      const curSum = nums[i] + nums[j] + nums[k]

      if (curSum === target)
        return curSum

      const curDistance = Math.abs(target - curSum)

      if (curDistance < distance) {
        distance = curDistance
        solution = curSum
      }

      if (curSum < target)
        j++
      else
        k--
    }
  }

  return solution
}
