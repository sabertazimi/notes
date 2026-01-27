export default function generateMatrix(n: number): number[][] {
  const solution = Array.from<number>({ length: n }).map(() => Array.from<number>({ length: n }))

  for (let i = 0, k = 1; k <= n * n; i++) {
    // 1. left to right
    let column = i
    while (column < n - i) solution[i][column++] = k++

    // 2. top to bottom
    let row = i + 1
    while (row < n - i) solution[row++][n - i - 1] = k++

    // 3. right to left
    column = n - i - 2
    while (column > i) solution[n - i - 1][column--] = k++

    // 4. bottom to  top
    row = n - i - 1
    while (row > i) solution[row--][i] = k++
  }

  return solution
}
