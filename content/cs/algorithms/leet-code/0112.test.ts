import solution from './0112'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description path-sum
 * @see {@link https://leetcode-cn.com/problems/path-sum/}
 * Given the root of a binary tree and an integer targetSum,
 * return true if the tree has a root-to-leaf path
 * such that adding up all the values along the path equals targetSum.
 */
describe('leetCode [0112]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([]), 20)).toStrictEqual(false)
    expect(solution(arrayToTree([1, 2]), 0)).toStrictEqual(false)
    expect(solution(arrayToTree([1, 2, 3]), 5)).toStrictEqual(false)
    expect(solution(arrayToTree([1, null, 2]), 3)).toStrictEqual(true)
    expect(
      solution(
        arrayToTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]),
        22,
      ),
    ).toStrictEqual(true)
  })
})
