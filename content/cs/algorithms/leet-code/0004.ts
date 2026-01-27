export default function findMedianSortedArrays(
  nums1: number[],
  nums2: number[],
): number {
  let i = 0
  let j = 0
  let k = 0
  const len1 = nums1.length
  const len2 = nums2.length
  const nums3 = Array.from<number>({ length: len1 + len2 }).fill(0)
  let median = 0.0

  // Merge sort
  while (j < len1 && k < len2)
    nums3[i++] = nums1[j] < nums2[k] ? nums1[j++] : nums2[k++]

  while (j < len1)
    nums3[i++] = nums1[j++]

  while (k < len2)
    nums3[i++] = nums2[k++]

  median
    = i % 2 === 0 ? nums3[i / 2 - 1] + nums3[i / 2] : 2 * nums3[Math.floor(i / 2)]
  median = median / 2.0

  return median
}
