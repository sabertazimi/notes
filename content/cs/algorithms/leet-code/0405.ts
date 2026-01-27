export default function toHex(num: number): string {
  if (num === 0)
    return '0'

  let res = ''

  while (num !== 0) {
    const cur = num & 0xF
    res = cur.toString(16) + res
    num >>>= 4
  }

  return res
}
