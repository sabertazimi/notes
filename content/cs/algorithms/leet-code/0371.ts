export default function getSum(a: number, b: number): number {
  // a: sum, b: carry
  return b === 0 ? a : getSum(a ^ b, (a & b) << 1)
}
