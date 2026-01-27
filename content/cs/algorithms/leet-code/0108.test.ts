import solution from './0108'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description convert-sorted-array-to-binary-search-tree
 * @see {@link https://leetcode-cn.com/problems/convert-sorted-array-to-binary-search-tree/}
 * Given an integer array nums where the elements are sorted in ascending order,
 * convert it to a height-balanced binary search tree.
 * A height-balanced binary tree is a binary tree
 * in which the depth of the two subtrees of every node never differs by more than one.
 */
describe('leetCode [0108]', () => {
  it('should AC', () => {
    expect(solution([1, 3])).toStrictEqual(arrayToTree([3, 1]))
    expect(solution([-10, -3, 0, 5, 9])).toStrictEqual(
      arrayToTree([0, -3, 9, -10, null, 5]),
    )
  })
})
