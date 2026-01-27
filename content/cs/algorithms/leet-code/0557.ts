export default function reverseWords(s: string): string {
  return s
    .split(' ')
    .map(string => string.split('').reverse().join(''))
    .join(' ')
}
