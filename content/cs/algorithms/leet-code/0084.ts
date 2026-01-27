export default function largestRectangleArea(heights: number[]): number {
  heights.unshift(0)
  heights.push(0)
  let res = 0

  // Record indices of elements with increase height
  const increaseStack: number[] = []
  increaseStack.push(0)

  for (let i = 1, top = 0; i < heights.length; i++) {
    while (
      // eslint-disable-next-line no-cond-assign -- Correctly assigns `top`.
      heights[i] < heights[(top = increaseStack[increaseStack.length - 1])]
    ) {
      increaseStack.pop()
      res = Math.max(
        res,
        heights[top] * (i - increaseStack[increaseStack.length - 1] - 1),
      )
    }

    // heights[i] >= heights[increaseStack.top()]
    // Push index of higher element to stack
    increaseStack.push(i)
  }

  return res
}
