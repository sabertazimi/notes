export default function singleNumber(nums: number[]): number {
  let res = 0

  for (let i = 0; i < 32; ++i) {
    let total = 0

    for (const num of nums)
      total += (num >> i) & 1

    if (total % 3 !== 0)
      res |= 1 << i
  }

  return res
}
