export default function findNthDigit(n: number): number {
  let digitLength = 1
  let digitCount = 9
  let num = 1

  while (digitLength * digitCount < n) {
    n -= digitLength * digitCount
    digitLength += 1
    digitCount *= 10
    num *= 10
  }

  num += Math.floor((n - 1) / digitLength)
  return num.toString().charCodeAt((n - 1) % digitLength) - '0'.charCodeAt(0)
}
