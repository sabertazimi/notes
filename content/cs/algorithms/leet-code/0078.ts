export default function subsets(nums: number[]): number[][] {
  const stack: number[] = []
  const ans: number[][] = []

  const dfs = (cur: number, nums: number[]) => {
    if (cur === nums.length) {
      ans.push(stack.slice())
      return
    }

    stack.push(nums[cur])
    dfs(cur + 1, nums)

    // Backtracking
    stack.pop()
    dfs(cur + 1, nums)
  }

  dfs(0, nums)

  return ans
}
