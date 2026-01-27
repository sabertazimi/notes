export default function constructRectangle(area: number): number[] {
  let width = Math.floor(Math.sqrt(area))
  while (area % width !== 0) width -= 1
  return [Math.floor(area / width), width]
}
