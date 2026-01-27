export default function addBinary(a: string, b: string): string {
  let solution = ''

  for (
    let i = a.length - 1, j = b.length - 1, carry = 0;
    i >= 0 || j >= 0 || carry;
    i--, j--, carry = Math.floor(carry / 2)
  ) {
    carry += i >= 0 ? Number.parseInt(a[i], 2) : 0
    carry += j >= 0 ? Number.parseInt(b[j], 2) : 0
    solution = (carry % 2).toString(2) + solution
  }

  return solution
}
