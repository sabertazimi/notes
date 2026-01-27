import solution from './0300'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description longest-increasing-subsequence
 * @see {@link https://leetcode-cn.com/problems/longest-increasing-subsequence/}
 * Given an integer array nums,
 * return the length of the longest strictly increasing subsequence.
 * A subsequence is a sequence that can be derived from
 * an array by deleting some or no elements without changing the order of the remaining elements.
 * For example, [3,6,2,7] is a subsequence of the array [0,3,1,6,2,2,7].
 */
describe('leetCode [0300]', () => {
  it('should AC', () => {
    expect(solution([])).toStrictEqual(0)
    expect(solution([0, 1, 0, 3, 2, 3])).toStrictEqual(4)
    expect(solution([10, 9, 2, 5, 3, 7, 101, 18])).toStrictEqual(4)
    expect(solution([7, 7, 7, 7, 7, 7, 7])).toStrictEqual(1)
  })
})
