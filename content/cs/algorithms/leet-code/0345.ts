export default function reverseVowels(s: string): string {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'])
  const sArr = s.split('')

  for (let left = 0, right = sArr.length - 1; left < right;) {
    if (vowels.has(sArr[left]) === false) {
      left++
    } else if (vowels.has(sArr[right]) === false) {
      right--
    } else {
      const temp = sArr[left]
      sArr[left] = sArr[right]
      sArr[right] = temp
      left++
      right--
    }
  }

  return sArr.join('')
}
