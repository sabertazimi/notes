export default function wordPattern(pattern: string, s: string): boolean {
  const patterns = pattern.split('')
  const words = s.split(' ')

  if (words.length !== patterns.length)
    return false

  const encodePattern = new Map<string, number>()
  const encodeWord = new Map<string, number>()

  for (let i = 0; i < words.length; i++) {
    if (encodePattern.get(patterns[i]) !== encodeWord.get(words[i]))
      return false

    encodePattern.set(patterns[i], i)
    encodeWord.set(words[i], i)
  }

  return true
}
