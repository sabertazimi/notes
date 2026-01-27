export default function intersection(
  nums1: number[],
  nums2: number[],
): number[] {
  const set1 = new Set<number>(nums1)
  const set2 = new Set<number>(nums2)
  const result = new Set<number>()

  for (const num of set1) {
    if (set2.has(num))
      result.add(num)
  }

  return [...result]
}
