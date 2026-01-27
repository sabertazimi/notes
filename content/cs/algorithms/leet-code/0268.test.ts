import solution from './0268'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description missing-number
 * @see {@link https://leetcode-cn.com/problems/missing-number/}
 * Given an array nums containing n distinct numbers in the range [0, n],
 * return the only number in the range that is missing from the array.
 */
describe('leetCode [0268]', () => {
  it('should AC', () => {
    expect(solution([0])).toStrictEqual(1)
    expect(solution([0, 1])).toStrictEqual(2)
    expect(solution([3, 0, 1])).toStrictEqual(2)
    expect(solution([9, 6, 4, 2, 3, 5, 7, 0, 1])).toStrictEqual(8)
  })
})
