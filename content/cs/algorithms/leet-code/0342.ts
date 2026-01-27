export default function isPowerOfFour(n: number): boolean {
  if (n <= 0)
    return false

  while (n % 4 === 0)
    n = Math.floor(n / 4)

  return n === 1
}
