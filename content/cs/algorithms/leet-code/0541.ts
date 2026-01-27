export default function reverseStr(s: string, k: number): string {
  if (k > s.length)
    return s.split('').reverse().join('')

  const result = s.split('')

  for (let i = 0, len = result.length; i < len; i += k << 1) {
    for (let l = i, r = Math.min(len - 1, i + k - 1); l < r; l++, r--) {
      const char = result[l]
      result[l] = result[r]
      result[r] = char
    }
  }

  return result.join('')
}
