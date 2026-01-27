export default function searchMatrix(
  matrix: number[][],
  target: number,
): boolean {
  const m = matrix.length
  const n = matrix[0].length
  let lo = 0
  let hi = m * n - 1

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1)
    const row = Math.floor(mid / n)
    const col = mid % n
    if (matrix[row][col] === target)
      return true
    else if (matrix[row][col] < target)
      lo = mid + 1
    else hi = mid - 1
  }

  return false
}
