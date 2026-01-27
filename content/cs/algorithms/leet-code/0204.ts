export default function countPrimes(n: number): number {
  if (n <= 1)
    return 0

  const prime = Array.from<boolean>({ length: n }).fill(true)
  prime[0] = false
  prime[1] = false

  // 筛子法求质数
  for (let i = 0; i < Math.sqrt(n); i++) {
    if (prime[i]) {
      for (let j = i * i; j < n; j += i) prime[j] = false
    }
  }

  return prime.filter(Boolean).length
}
