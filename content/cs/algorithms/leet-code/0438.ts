export default function findAnagrams(s: string, p: string): number[] {
  const res: number[] = []
  const dict: Map<string, number> = new Map()

  for (const char of p)
    dict.set(char, dict.has(char) ? (dict.get(char) as number) + 1 : 1)

  for (
    let lo = 0, hi = 0, freq: number[] = Array.from<number>({ length: 26 }).fill(0);
    hi < s.length;
    hi++
  ) {
    if (dict.has(s.charAt(hi)) === false) {
      // 滑动窗口中含有 p 中没有的字符
      freq.fill(0)
      lo = hi + 1
    } else {
      freq[s.charAt(hi).charCodeAt(0) - 'a'.charCodeAt(0)]++

      // 滑动窗口中某个字符的数量超过了 p 中该字符的数量
      while (
        (dict.get(s.charAt(hi)) as number)
        < freq[s.charAt(hi).charCodeAt(0) - 'a'.charCodeAt(0)]
      ) {
        freq[s.charAt(lo).charCodeAt(0) - 'a'.charCodeAt(0)]--
        lo++
      }

      if (hi - lo + 1 === p.length) {
        res.push(lo)
        freq[s.charAt(lo).charCodeAt(0) - 'a'.charCodeAt(0)]--
        lo++
      }
    }
  }

  return res
}
