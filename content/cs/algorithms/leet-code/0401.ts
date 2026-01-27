export default function readBinaryWatch(turnedOn: number): string[] {
  if (turnedOn > 8)
    return []

  const result: string[] = []

  for (let h = 0; h < 12; ++h) {
    for (let m = 0; m < 60; ++m) {
      if (
        h.toString(2).split('0').join('').length
        + m.toString(2).split('0').join('').length
        === turnedOn
      ) {
        result.push(`${h}:${m < 10 ? '0' : ''}${m}`)
      }
    }
  }

  return result
}
