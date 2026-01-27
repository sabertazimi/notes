import solution from './0485'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description max-consecutive-ones
 * @see {@link https://leetcode-cn.com/problems/max-consecutive-ones/}
 * Given a binary array nums,
 * return the maximum number of consecutive 1's in the array.
 */
describe('leetCode [0485]', () => {
  it('should AC', () => {
    expect(solution([1, 1, 0, 1, 1, 1])).toStrictEqual(3)
    expect(solution([1, 0, 1, 1, 0, 1])).toStrictEqual(2)
  })
})
