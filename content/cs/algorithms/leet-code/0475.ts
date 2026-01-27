export default function findRadius(
  houses: number[],
  heaters: number[],
): number {
  let radius = 0
  let index = 0

  houses.sort((a, b) => a - b)
  heaters.sort((a, b) => a - b)

  for (const house of houses) {
    while (
      index + 1 < heaters.length
      && Math.abs(heaters[index + 1] - house) <= Math.abs(heaters[index] - house)
    ) {
      index++
    }

    radius = Math.max(radius, Math.abs(heaters[index] - house))
  }

  return radius
}
