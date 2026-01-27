export default function findWords(words: string[]): string[] {
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
  const result: string[] = []

  for (const word of words) {
    const normalizedWord = word.toLowerCase()
    let flag = true
    let row = 0

    while (row < rows.length) {
      if (rows[row].includes(normalizedWord[0]))
        break
      row++
    }

    for (let i = 1; i < normalizedWord.length; i++) {
      if (rows[row].includes(normalizedWord[i]) === false) {
        flag = false
        break
      }
    }

    if (flag)
      result.push(word)
  }

  return result
}
