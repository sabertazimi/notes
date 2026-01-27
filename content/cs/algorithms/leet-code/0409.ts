export default function longestPalindrome(s: string): number {
  const map = new Map<string, number>()

  for (const char of s) {
    if (map.has(char))
      map.set(char, (map.get(char) as number) + 1)
    else map.set(char, 1)
  }

  let odd = 0

  for (const count of map.values()) {
    if (count % 2 === 1)
      odd++
  }

  return odd > 1 ? s.length - odd + 1 : s.length
}
