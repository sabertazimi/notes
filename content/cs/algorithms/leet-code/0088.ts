export default function merge(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number,
): number[] {
  const sortedNums = nums1
    .slice(0, m)
    .concat(nums2.slice(0, n))
    .sort((a, b) => a - b)
  nums1.splice(0)
  nums1.push(...sortedNums)
  return nums1
}
