export default function nthUglyNumber(n: number): number {
  const nums = [1]

  for (let [count, i, j, k] = Array.from<number>({ length: 4 }).fill(0); count < n; count++) {
    const m2 = nums[i] * 2
    const m3 = nums[j] * 3
    const m5 = nums[k] * 5
    const min = Math.min(m2, m3, m5)
    if (min === m2)
      i++
    if (min === m3)
      j++
    if (min === m5)
      k++
    nums.push(min)
  }

  return nums[n - 1]
}
