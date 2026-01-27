import solution from './0015'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description 3sum
 * @see {@link https://leetcode-cn.com/problems/3sum/}
 * Given an integer array nums,
 * return all the triplets [nums[i], nums[j], nums[k]]
 * such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
 * Notice that the solution set must not contain duplicate triplets.
 */
describe('leetCode [0015]', () => {
  it('should AC', () => {
    expect(solution([])).toStrictEqual([])
    expect(solution([0])).toStrictEqual([])
    expect(solution([1, 2, 3])).toStrictEqual([])
    expect(solution([-1, 0, 0, 1, 1, 1])).toStrictEqual([[-1, 0, 1]])
    expect(solution([-1, 0, 1, 2, -1, -4])).toStrictEqual([
      [-1, -1, 2],
      [-1, 0, 1],
    ])
    expect(solution([-1, 0, 1, 2, -1, -4, -2, -3, 3, 0, 4])).toStrictEqual([
      [-4, 0, 4],
      [-4, 1, 3],
      [-3, -1, 4],
      [-3, 0, 3],
      [-3, 1, 2],
      [-2, -1, 3],
      [-2, 0, 2],
      [-1, -1, 2],
      [-1, 0, 1],
    ])
  })
})
