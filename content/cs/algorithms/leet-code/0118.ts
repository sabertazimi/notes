export default function generate(numRows: number): number[][] {
  const result: number[][] = []

  for (let i = 0; i < numRows; i++) {
    const start = 0
    const end = i
    result[i] = []
    result[i][start] = 1
    result[i][end] = 1

    for (let j = start + 1; j < end; j++)
      result[i][j] = result[i - 1][j - 1] + result[i - 1][j]
  }

  return result
}
