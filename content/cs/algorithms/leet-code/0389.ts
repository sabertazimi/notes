export default function findTheDifference(s: string, t: string): string {
  let res = 0
  for (let i = 0; i < s.length; i++) res ^= s.charCodeAt(i)
  for (let i = 0; i < t.length; i++) res ^= t.charCodeAt(i)
  return String.fromCharCode(res)
}
