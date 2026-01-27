import type { TreeNode } from './Tree'
import solution from './0235'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description lowest-common-ancestor-of-a-binary-search-tree
 * @see {@link https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-search-tree/}
 * Given a binary search tree (BST),
 * find the lowest common ancestor (LCA) of two given nodes in the BST.
 * According to the definition of LCA on Wikipedia:
 * The lowest common ancestor is defined between two nodes p and q as the lowest node in T
 * that has both p and q as descendants (where we allow a node to be a descendant of itself).
 */
describe('leetCode [0235]', () => {
  it('should AC', () => {
    const tree = arrayToTree([
      6,
      2,
      8,
      0,
      4,
      7,
      9,
      null,
      null,
      3,
      5,
    ]) as TreeNode<number>
    expect(
      solution(
        tree,
        tree?.left as TreeNode<number>,
        tree?.right as TreeNode<number>,
      ),
    ).toStrictEqual(tree)
    expect(
      solution(
        tree,
        tree?.left as TreeNode<number>,
        tree?.left?.right as TreeNode<number>,
      ),
    ).toStrictEqual(tree?.left)
    expect(
      solution(
        tree,
        tree?.right as TreeNode<number>,
        tree?.right?.right as TreeNode<number>,
      ),
    ).toStrictEqual(tree?.right)
  })
})
