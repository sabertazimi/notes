export default function convertToTitle(columnNumber: number): string {
  let solution = ''

  while (columnNumber > 0) {
    const left = (columnNumber - 1) % 26
    solution = String.fromCharCode(65 + left) + solution
    columnNumber = Math.floor((columnNumber - left) / 26)
  }

  return solution
}
