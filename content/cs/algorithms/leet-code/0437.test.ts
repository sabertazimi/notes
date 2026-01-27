import solution from './0437'
import { arrayToTree } from './Tree'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description path-sum-iii
 * @see {@link https://leetcode-cn.com/problems/path-sum-iii/}
 * Given the root of a binary tree and an integer targetSum,
 * return the number of paths where the sum of the values along the path equals targetSum.
 * The path does not need to start or end at the root or a leaf,
 * but it must go downwards (i.e., traveling only from parent nodes to child nodes).
 */
describe('leetCode [0437]', () => {
  it('should AC', () => {
    expect(
      solution(arrayToTree([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]), 8),
    ).toStrictEqual(3)
    expect(
      solution(
        arrayToTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]),
        22,
      ),
    ).toStrictEqual(3)
  })
})
