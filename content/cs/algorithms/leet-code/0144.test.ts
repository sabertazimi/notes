import solution from './0144'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description binary-tree-preorder-traversal
 * @see {@link https://leetcode-cn.com/problems/binary-tree-preorder-traversal/}
 * Given the root of a binary tree,
 * return the preorder traversal of its nodes' values.
 */
describe('leetCode [0144]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([]))).toStrictEqual([])
    expect(solution(arrayToTree([1]))).toStrictEqual([1])
    expect(solution(arrayToTree([1, 2]))).toStrictEqual([1, 2])
    expect(solution(arrayToTree([1, null, 2]))).toStrictEqual([1, 2])
    expect(solution(arrayToTree([1, null, 2, 3]))).toStrictEqual([1, 2, 3])
    expect(solution(arrayToTree([1, 2, 3, null, 5]))).toStrictEqual([
      1,
      2,
      5,
      3,
    ])
  })
})
