import solution from './0018'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description 4sum
 * @see {@link https://leetcode-cn.com/problems/4sum/}
 * Given an array nums of n integers,
 * return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that:
 * 0 <= a, b, c, d < n.
 * a, b, c, and d are distinct.
 * nums[a] + nums[b] + nums[c] + nums[d] == target
 * You may return the answer in any order.
 */
describe('leetCode [0018]', () => {
  it('should AC', () => {
    expect(solution([], 0)).toStrictEqual([])
    expect(solution([0], 0)).toStrictEqual([])
    expect(solution([1, 2, 3], 0)).toStrictEqual([])
    expect(solution([2, 2, 2, 2, 2], 8)).toStrictEqual([[2, 2, 2, 2]])
    expect(solution([1, 0, -1, 0, -2, 2], 0)).toStrictEqual([
      [-2, -1, 1, 2],
      [-2, 0, 0, 2],
      [-1, 0, 0, 1],
    ])
    expect(solution([1, 0, -1, 0, -2, 2, 1, 0, -1, 0, -2, 2], 0)).toStrictEqual(
      [
        [-2, -2, 2, 2],
        [-2, -1, 1, 2],
        [-2, 0, 0, 2],
        [-2, 0, 1, 1],
        [-1, -1, 0, 2],
        [-1, -1, 1, 1],
        [-1, 0, 0, 1],
        [0, 0, 0, 0],
      ],
    )
  })
})
