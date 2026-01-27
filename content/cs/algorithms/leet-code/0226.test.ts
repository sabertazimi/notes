import solution from './0226'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description invert-binary-tree
 * @see {@link https://leetcode-cn.com/problems/invert-binary-tree/}
 * Given the root of a binary tree,
 * invert the tree, and return its root.
 */
describe('leetCode [0226]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([]))).toStrictEqual(arrayToTree([]))
    expect(solution(arrayToTree([2, 1, 3]))).toStrictEqual(
      arrayToTree([2, 3, 1]),
    )
    expect(solution(arrayToTree([4, 2, 7, 1, 3, 6, 9]))).toStrictEqual(
      arrayToTree([4, 7, 2, 9, 6, 3, 1]),
    )
  })
})
