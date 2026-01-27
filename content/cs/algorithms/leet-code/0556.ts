export default function nextGreaterElement(n: number): number {
  const digits = n.toString().split('')
  let exist = false
  let left = -1
  let right = -1

  // Find the first digit that is smaller than the digit on the top of the stack.
  for (let i = digits.length - 1, stack: number[] = []; i >= 0; i--) {
    while (stack.length && digits[i] < digits[stack[stack.length - 1]]) {
      exist = true
      left = i
      right = stack.pop() as number
    }
    if (exist)
      break
    stack.push(i)
  }

  if (exist === false)
    return -1

  // 158476531 => 158576431
  const digit = digits[left]
  digits[left] = digits[right]
  digits[right] = digit

  // 158576431 => 158513467
  const result = Number.parseInt(
    digits
      .slice(0, left + 1)
      .concat(digits.slice(left + 1).reverse())
      .join(''),
    10,
  )
  return result > 2 ** 31 - 1 ? -1 : result
}
