export default function plusOne(digits: number[]): number[] {
  let carry = true

  for (let i = digits.length - 1; i >= 0 && carry; i--) {
    digits[i] = digits[i] + 1
    digits[i] = digits[i] % 10
    carry = digits[i] === 0
  }

  if (carry)
    digits.unshift(1)

  return digits
}
