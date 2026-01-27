import solution from './0111'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description minimum-depth-of-binary-tree
 * @see {@link https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/}
 * Given a binary tree, find its minimum depth.
 * The minimum depth is the number of nodes
 * along the shortest path from the root node down to the nearest leaf node.
 */
describe('leetCode [0111]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([]))).toStrictEqual(0)
    expect(solution(arrayToTree([1]))).toStrictEqual(1)
    expect(solution(arrayToTree([1, 2]))).toStrictEqual(2)
    expect(solution(arrayToTree([3, 9, 20, null, null, 15, 7]))).toStrictEqual(
      2,
    )
    expect(
      solution(arrayToTree([2, null, 3, null, 4, null, 5, null, 6])),
    ).toStrictEqual(5)
  })
})
