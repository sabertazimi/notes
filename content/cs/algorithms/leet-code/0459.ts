export default function repeatedSubstringPattern(s: string): boolean {
  return (s + s).slice(1, -1).includes(s)
}
