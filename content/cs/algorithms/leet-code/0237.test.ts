import type { ListNode } from './List'
import solution from './0237'
import { arrayToList } from './List'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description delete-node-in-a-linked-list
 * @see {@link https://leetcode-cn.com/problems/delete-node-in-a-linked-list/}
 * Write a function to delete a node in a singly-linked list.
 * You will not be given access to the head of the list,
 * instead you will be given access to the node to be deleted directly.
 */
describe('leetCode [0237]', () => {
  it('should AC', () => {
    expect(solution(arrayToList([1, 2, 3]) as ListNode<number>)).toStrictEqual(
      arrayToList([2, 3]),
    )
  })
})
