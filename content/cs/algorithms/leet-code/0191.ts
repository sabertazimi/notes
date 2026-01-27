export default function hammingWeight(n: number): number {
  let res = 0

  while (n) {
    res += n & 1
    n = n >>> 1
  }

  return res
}
