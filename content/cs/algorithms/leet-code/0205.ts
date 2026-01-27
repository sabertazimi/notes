export default function isIsomorphic(s: string, t: string): boolean {
  if (s.length !== t.length)
    return false
  if (s.length < 2)
    return true

  const encodeS = new Map<string, number>()
  const encodeT = new Map<string, number>()

  for (let i = 0; i < s.length; i++) {
    if (encodeS.get(s[i]) !== encodeT.get(t[i]))
      return false
    encodeS.set(s[i], i)
    encodeT.set(t[i], i)
  }

  return true
}
