export default function findDisappearedNumbers(nums: number[]): number[] {
  const result: number[] = []

  for (let i = 0, numsSet = new Set(nums); i < nums.length; i++) {
    if (numsSet.has(i + 1) === false)
      result.push(i + 1)
  }

  return result
}
