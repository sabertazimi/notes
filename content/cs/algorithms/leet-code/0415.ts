export default function addStrings(num1: string, num2: string): string {
  let result = ''

  for (
    let m = num1.length - 1, n = num2.length - 1, carry = 0;
    m >= 0 || n >= 0 || carry !== 0;
    m--, n--
  ) {
    const a = m >= 0 ? num1.charCodeAt(m) - '0'.charCodeAt(0) : 0
    const b = n >= 0 ? num2.charCodeAt(n) - '0'.charCodeAt(0) : 0
    const sum = a + b + carry
    result = (sum % 10).toString() + result
    carry = Math.floor(sum / 10)
  }

  return result
}
