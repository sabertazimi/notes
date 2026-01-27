export default function lengthOfLastWord(s: string): number {
  const array = s.split(' ').filter(Boolean)
  return array[array.length - 1].length
}
