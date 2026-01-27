export default function containsDuplicate(nums: number[]): boolean {
  const set = new Set<number>()

  for (const num of nums) {
    if (set.has(num))
      return true
    set.add(num)
  }

  return false
}
