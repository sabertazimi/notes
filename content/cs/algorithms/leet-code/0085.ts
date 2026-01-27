import largestRectangleArea from './0084'

export default function maximalRectangle(matrix: string[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0)
    return 0

  const m = matrix.length
  const n = matrix[0].length
  const heights = Array.from<number>({ length: m }).map(() => Array.from<number>({ length: n }).fill(0))

  // Use dynamic programming to calculate heights of `m` histograms
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === '1')
        heights[i][j] = i === 0 ? 1 : heights[i - 1][j] + 1
    }
  }

  let res = 0

  for (let i = 0; i < m; i++)
    res = Math.max(res, largestRectangleArea(heights[i]))

  return res
}
