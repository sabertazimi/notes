export default function findLongestUncommonSubsequenceLength(
  a: string,
  b: string,
): number {
  if (a === b)
    return -1
  return Math.max(a.length, b.length)
}
