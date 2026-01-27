import solution from './0145'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description binary-tree-postorder-traversal
 * @see {@link https://leetcode-cn.com/problems/binary-tree-postorder-traversal/}
 * Given the root of a binary tree,
 * return the postorder traversal of its nodes' values.
 */
describe('leetCode [0145]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([]))).toStrictEqual([])
    expect(solution(arrayToTree([1]))).toStrictEqual([1])
    expect(solution(arrayToTree([1, 2]))).toStrictEqual([2, 1])
    expect(solution(arrayToTree([1, null, 2]))).toStrictEqual([2, 1])
    expect(solution(arrayToTree([1, null, 2, 3]))).toStrictEqual([3, 2, 1])
    expect(solution(arrayToTree([1, 2, 3, null, 5]))).toStrictEqual([
      5,
      2,
      3,
      1,
    ])
  })
})
