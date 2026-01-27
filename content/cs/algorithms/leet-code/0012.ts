export default function intToRoman(num: number): string {
  const map = new Map<number, string>([
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ])
  let roman = ''
  let left = num

  for (const [num, str] of map.entries()) {
    if (left >= num) {
      const times = Math.floor(left / num)
      roman += str.repeat(times)
      left -= num * times
    }
  }

  return roman
}
