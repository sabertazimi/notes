export default function nextGreaterElement(
  nums1: number[],
  nums2: number[],
): number[] {
  const stack: number[] = []
  const greaterMap = new Map<number, number>()

  for (const num of nums2) {
    while (stack.length && stack[stack.length - 1] < num)
      greaterMap.set(stack.pop() as number, num)

    stack.push(num)
  }

  const result: number[] = []
  for (const num of nums1) result.push(greaterMap.get(num) ?? -1)
  return result
}
