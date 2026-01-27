export default function reverseBits(n: number): number {
  let res = 0

  for (let i = 0; i < 32; i++, n = n >>> 1) {
    const bit = n & 1
    res = res << 1
    res = res | bit
  }

  return res >>> 0
}
