export default function twoSum(numbers: number[], target: number): number[] {
  const res: number[] = []

  let lo = 0
  let hi = numbers.length - 1

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1)
    if (numbers[lo] + numbers[mid] > target) {
      hi = mid - 1
    } else if (numbers[hi] + numbers[mid] < target) {
      lo = mid + 1
    } else if (numbers[lo] + numbers[hi] < target) {
      lo++
    } else if (numbers[lo] + numbers[hi] > target) {
      hi--
    } else {
      res.push(lo + 1, hi + 1)
      break
    }
  }

  return res
}
