export default function intersect(nums1: number[], nums2: number[]): number[] {
  const map: Map<number, number> = new Map<number, number>()
  const result: number[] = []

  for (const num of nums1) {
    if (map.has(num))
      map.set(num, (map.get(num) as number) + 1)
    else map.set(num, 1)
  }

  for (const num of nums2) {
    if (map.has(num)) {
      if ((map.get(num) as number) > 0) {
        result.push(num)
        map.set(num, (map.get(num) as number) - 1)
      }
    }
  }

  return result
}
