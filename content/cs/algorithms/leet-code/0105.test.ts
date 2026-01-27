import solution from './0105'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description construct-binary-tree-from-preorder-and-inorder-traversal
 * @see {@link https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/}
 * Given two integer arrays preorder and inorder
 * where preorder is the preorder traversal of a binary tree
 * and inorder is the inorder traversal of the same tree,
 * construct and return the binary tree.
 */
describe('leetCode [0105]', () => {
  it('should AC', () => {
    expect(solution([-1], [-1])).toStrictEqual(arrayToTree([-1]))
    expect(solution([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])).toStrictEqual(
      arrayToTree([3, 9, 20, null, null, 15, 7]),
    )
  })
})
