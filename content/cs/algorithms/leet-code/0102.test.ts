import solution from './0102'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description binary-tree-level-order-traversal
 * @see {@link https://leetcode-cn.com/problems/binary-tree-level-order-traversal/}
 * Given the root of a binary tree,
 * return the level order traversal of its nodes' values.
 * (i.e., from left to right, level by level).
 */
describe('leetCode [0102]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([]))).toStrictEqual([])
    expect(solution(arrayToTree([1]))).toStrictEqual([[1]])
    expect(solution(arrayToTree([3, 9, 20, null, null, 15, 7]))).toStrictEqual([
      [3],
      [9, 20],
      [15, 7],
    ])
    expect(solution(arrayToTree([3, 9, 20, 4, 5, 15, 7]))).toStrictEqual([
      [3],
      [9, 20],
      [4, 5, 15, 7],
    ])
  })
})
