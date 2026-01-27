import solution from './0104'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description maximum-depth-of-binary-tree
 * @see {@link https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/}
 * Given the root of a binary tree, return its maximum depth.
 * A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.
 */
describe('leetCode [0104]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([]))).toStrictEqual(0)
    expect(solution(arrayToTree([1]))).toStrictEqual(1)
    expect(solution(arrayToTree([1, null, 2]))).toStrictEqual(2)
    expect(solution(arrayToTree([3, 9, 20, null, null, 15, 7]))).toStrictEqual(
      3,
    )
  })
})
