import solution from './0110'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description balanced-binary-tree
 * @see {@link https://leetcode-cn.com/problems/balanced-binary-tree/}
 * Given a binary tree, determine if it is height-balanced.
 * For this problem, a height-balanced binary tree is defined as:
 * a binary tree in which the left and right subtrees of every node
 * differ in height by no more than 1.
 */
describe('leetCode [0110]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([]))).toStrictEqual(true)
    expect(solution(arrayToTree([3, 9, 20, null, null, 15, 7]))).toStrictEqual(
      true,
    )
    expect(
      solution(arrayToTree([1, 2, 2, 3, 3, null, null, 4, 4])),
    ).toStrictEqual(false)
  })
})
