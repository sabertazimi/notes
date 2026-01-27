export default function searchMatrix(
  matrix: number[][],
  target: number,
): boolean {
  for (let [i, j] = [0, matrix[0].length - 1]; i < matrix.length && j >= 0;) {
    if (matrix[i][j] === target)
      return true
    else if (matrix[i][j] > target)
      j--
    else i++
  }

  return false
}
