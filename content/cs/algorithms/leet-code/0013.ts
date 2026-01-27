export default function romanToInt(s: string): number {
  const map = new Map<string, number>([
    ['I', 1],
    ['V', 5],
    ['X', 10],
    ['L', 50],
    ['C', 100],
    ['D', 500],
    ['M', 1000],
  ])

  let sum = map.get(s.charAt(s.length - 1)) as number

  for (let i = s.length - 2; i >= 0; i--) {
    const num1 = map.get(s.charAt(i)) as number
    const num2 = map.get(s.charAt(i + 1)) as number

    if (num1 < num2)
      sum -= num1
    else
      sum += num1
  }

  return sum
}
