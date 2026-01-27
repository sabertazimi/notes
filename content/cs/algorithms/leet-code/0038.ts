export default function countAndSay(n: number): string {
  if (n === 1)
    return '1'

  const prevSay = countAndSay(n - 1)
  let curSay = ''
  let pos = 0
  while (pos < prevSay.length) {
    const start = pos
    let end = pos + 1
    while (prevSay[start] === prevSay[end]) end++
    const times = end - start
    curSay += `${times}${prevSay[start]}`
    pos += end - start
  }
  return curSay
}
