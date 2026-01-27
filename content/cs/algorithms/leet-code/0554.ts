export default function leastBricks(wall: number[][]): number {
  // 竖线穿过最多的缝隙
  const gapMap = new Map<number, number>()
  let maxGap = 0

  for (const row of wall) {
    for (let i = 0, offset = 0; i < row.length - 1; i++) {
      offset += row[i]
      gapMap.set(offset, (gapMap.get(offset) ?? 0) + 1)
      maxGap = Math.max(maxGap, gapMap.get(offset) as number)
    }
  }

  return wall.length - maxGap
}
