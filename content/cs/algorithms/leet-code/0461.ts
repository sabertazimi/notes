export default function hammingDistance(x: number, y: number): number {
  let result = 0

  for (let sum = x ^ y; sum; sum >>>= 1)
    result += sum & 1

  return result
}
