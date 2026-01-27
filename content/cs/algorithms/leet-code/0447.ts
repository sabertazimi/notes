export default function numberOfBoomerangs(points: number[][]): number {
  let res = 0

  for (let i = 0; i < points.length; i++) {
    // `i` is the center point
    const map = new Map<number, number>()

    for (let j = 0; j < points.length; j++) {
      const dx = points[i][0] - points[j][0]
      const dy = points[i][1] - points[j][1]
      const distance = dx * dx + dy * dy
      map.set(distance, (map.get(distance) ?? 0) + 1)
    }

    // Find left 2 points
    for (const count of map.values()) {
      // 组合: C(count, 2)
      res += count * (count - 1)
    }
  }

  return res
}
