export default function findCircleNum(isConnected: number[][]): number {
  const n = isConnected.length
  const visited = Array.from<boolean>({ length: n }).fill(false)
  const dfs = (i: number) => {
    visited[i] = true

    for (let j = 0; j < n; j++) {
      if (visited[j] === false && isConnected[i][j])
        dfs(j)
    }
  }

  let count = 0

  for (let i = 0; i < n; i++) {
    if (visited[i] === false) {
      dfs(i)
      count++
    }
  }

  return count
}
