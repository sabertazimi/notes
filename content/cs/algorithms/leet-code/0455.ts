export default function findContentChildren(g: number[], s: number[]): number {
  g.sort((a, b) => a - b)
  s.sort((a, b) => a - b)

  let res = 0

  for (let i = 0; res < g.length && i < s.length; i++) {
    if (g[res] <= s[i])
      res++
  }

  return res
}
