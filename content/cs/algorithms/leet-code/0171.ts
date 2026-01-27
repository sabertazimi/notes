export default function titleToNumber(columnTitle: string): number {
  let res = 0

  for (const ch of columnTitle)
    res = res * 26 + ch.charCodeAt(0) - 'A'.charCodeAt(0) + 1

  return res
}
