import solution from './0414'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description third-maximum-number
 * @see {@link https://leetcode-cn.com/problems/third-maximum-number/}
 * Given integer array nums,
 * return the third maximum number in this array.
 * If the third maximum does not exist, return the maximum number.
 */
describe('leetCode [0414]', () => {
  it('should AC', () => {
    expect(solution([1, 2])).toStrictEqual(2)
    expect(solution([3, 2, 1])).toStrictEqual(1)
    expect(solution([2, 2, 3, 1])).toStrictEqual(1)
  })
})
