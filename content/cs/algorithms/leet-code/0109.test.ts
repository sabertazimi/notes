import solution from './0109'
import { arrayToList } from './List'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description convert-sorted-list-to-binary-search-tree
 * @see {@link https://leetcode-cn.com/problems/convert-sorted-list-to-binary-search-tree/}
 * Given the head of a singly linked list where elements are sorted in ascending order,
 * convert it to a height balanced BST.
 * For this problem,
 * a height-balanced binary tree is defined as a binary tree
 * in which the depth of the two subtrees of every node never differ by more than 1.
 */
describe('leetCode [0109]', () => {
  it('should AC', () => {
    expect(solution(arrayToList([]))).toStrictEqual(arrayToTree([]))
    expect(solution(arrayToList([0]))).toStrictEqual(arrayToTree([0]))
    expect(solution(arrayToList([1, 3]))).toStrictEqual(arrayToTree([3, 1]))
    expect(solution(arrayToList([-10, -3, 0, 5, 9]))).toStrictEqual(
      arrayToTree([0, -3, 9, -10, null, 5]),
    )
  })
})
