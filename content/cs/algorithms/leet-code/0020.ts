export default function isValid(s: string): boolean {
  if (s.length % 2 === 1)
    return false

  const pairs = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
  ])

  const tokens: string[] = []

  for (let i = 0; i < s.length; i++) {
    const ch = s[i]

    if (pairs.has(ch)) {
      if (tokens.length === 0 || tokens[tokens.length - 1] !== pairs.get(ch))
        return false

      tokens.pop()
    } else {
      tokens.push(ch)
    }
  }

  return tokens.length === 0
}
