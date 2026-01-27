export default function isAnagram(s: string, t: string): boolean {
  return s.split('').sort().join('') === t.split('').sort().join('')
}
