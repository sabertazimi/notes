export default function firstUniqChar(s: string): number {
  const map = new Map<string, number>()

  for (let i = 0; i < s.length; i++) {
    const char = s[i]
    if (map.has(char))
      map.set(char, -1)
    else map.set(char, i)
  }

  for (const index of map.values()) {
    if (index !== -1)
      return index
  }

  return -1
}
