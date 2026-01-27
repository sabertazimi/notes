function squareNum(n: number): number {
  let sum = 0

  while (n) {
    sum += (n % 10) * (n % 10)
    n = Math.floor(n / 10)
  }

  return sum
}

export default function isHappy(n: number): boolean {
  let slow = n
  let fast = n

  do {
    slow = squareNum(slow)
    fast = squareNum(squareNum(fast))
  } while (slow !== fast)

  if (slow === 1)
    return true
  else
    return false
}
