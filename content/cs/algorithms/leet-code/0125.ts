export default function isPalindrome(s: string): boolean {
  const normalizedStringArray = s
    .toLowerCase()
    .split('')
    .filter(ch => ch.match(/[a-z0-9]/))
  const normalizedString = normalizedStringArray.join('')
  const normalizedReverseString = normalizedStringArray.reverse().join('')
  return normalizedString === normalizedReverseString
}
