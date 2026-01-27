import solution from './0189'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description rotate-array
 * @see {@link https://leetcode-cn.com/problems/rotate-array/}
 * Given an array, rotate the array to the right by k steps, where k is non-negative.
 */
describe('leetCode [0189]', () => {
  it('should AC', () => {
    expect(solution([], 0)).toStrictEqual([])
    expect(solution([1], 0)).toStrictEqual([1])
    expect(solution([-1, -100, 3, 99], 2)).toStrictEqual([3, 99, -1, -100])
    expect(solution([1, 2, 3, 4, 5, 6, 7], 3)).toStrictEqual([
      5,
      6,
      7,
      1,
      2,
      3,
      4,
    ])
  })
})
