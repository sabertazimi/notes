export default function convert(s: string, numRows: number): string {
  if (numRows === 1)
    return s

  const n = s.length
  const cycleLen = 2 * numRows - 2
  let ret = ''

  // 行 0 中的字符位于索引 k * (2 * numRows - 2).
  // 行 numRows - 1 中的字符位于索引 k * (2 * numRows - 2) + numRows - 1.
  // 中间 i 行中的字符位于 k * (2 * numRows - 2) + i 以及 (k + 1) * (2 * numRows - 2) - i.
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j + i < n; j += cycleLen) {
      ret += s[j + i]
      if (i !== 0 && i !== numRows - 1 && j + cycleLen - i < n)
        ret += s[j + cycleLen - i]
    }
  }

  return ret
}
