export default function findComplement(num: number): number {
  let mask = ~0
  while (mask & num) mask <<= 1
  return ~mask ^ num
}
