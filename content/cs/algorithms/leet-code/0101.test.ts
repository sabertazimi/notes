import solution from './0101'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description symmetric-tree
 * @see {@link https://leetcode-cn.com/problems/symmetric-tree/}
 * Given the root of a binary tree,
 * check whether it is a mirror of itself.
 */
describe('leetCode [0101]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([]))).toStrictEqual(true)
    expect(solution(arrayToTree([1, 2, 2, null, 3, null, 3]))).toStrictEqual(
      false,
    )
    expect(solution(arrayToTree([1, 2, 2, 3, 5, 4, 3]))).toStrictEqual(false)
    expect(solution(arrayToTree([1, 2, 2, 3, 4, 4, 3]))).toStrictEqual(true)
  })
})
