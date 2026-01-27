import solution from './0113'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description path-sum-ii
 * @see {@link https://leetcode-cn.com/problems/path-sum-ii/}
 * Given the root of a binary tree and an integer targetSum,
 * return true if the tree has a root-to-leaf path
 * such that adding up all the values along the path equals targetSum.
 */
describe('leetCode [0113]', () => {
  it('should AC', () => {
    expect(solution(arrayToTree([]), 20)).toStrictEqual([])
    expect(solution(arrayToTree([1]), 1)).toStrictEqual([[1]])
    expect(solution(arrayToTree([1, 2]), 0)).toStrictEqual([])
    expect(solution(arrayToTree([1, 2, 3]), 5)).toStrictEqual([])
    expect(solution(arrayToTree([1, null, 2]), 3)).toStrictEqual([[1, 2]])
    expect(
      solution(
        arrayToTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]),
        22,
      ),
    ).toStrictEqual([
      [5, 4, 11, 2],
      [5, 8, 4, 5],
    ])
  })
})
