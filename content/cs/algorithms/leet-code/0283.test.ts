import solution from './0283'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description move-zeros
 * @see {@link https://leetcode-cn.com/problems/move-zeroes/}
 * Given an integer array nums,
 * move all 0's to the end of it while maintaining the relative order of the non-zero elements.
 */
describe('leetCode [0283]', () => {
  it('should AC', () => {
    expect(solution([0])).toStrictEqual([0])
    expect(solution([0, 0, 1])).toStrictEqual([1, 0, 0])
    expect(solution([0, 1, 0, 3, 12])).toStrictEqual([1, 3, 12, 0, 0])
  })
})
