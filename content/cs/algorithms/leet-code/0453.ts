export default function minMoves(nums: number[]): number {
  let moves = 0
  const min = Math.min(...nums)
  for (const num of nums) moves += num - min
  return moves
}
