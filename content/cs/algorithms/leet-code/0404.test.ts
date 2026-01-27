import solution from './0404'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description sum-of-left-leaves
 * @see {@link https://leetcode-cn.com/problems/sum-of-left-leaves/}
 * Given the root of a binary tree,
 * return the sum of all left leaves.
 */
describe('leetCode [0404]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([0]))).toStrictEqual(0)
    expect(solution(arrayToTree([1]))).toStrictEqual(0)
    expect(solution(arrayToTree([3, 9, 20, null, null, 15, 7]))).toStrictEqual(
      24,
    )
  })
})
