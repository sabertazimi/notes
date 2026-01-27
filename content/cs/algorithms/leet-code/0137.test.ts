import solution from './0137'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description single-number-ii
 * @see {@link https://leetcode-cn.com/problems/single-number-ii/}
 * Given an integer array nums where every element appears three times except for one,
 * which appears exactly once.
 * Find the single element and return it.
 * You must implement a solution with a linear runtime complexity
 * and use only constant extra space.
 */
describe('leetCode [0137]', () => {
  it('should AC', () => {
    expect(solution([1])).toStrictEqual(1)
    expect(solution([1, 1])).toStrictEqual(1)
    expect(solution([2, 2, 3, 2])).toStrictEqual(3)
    expect(solution([0, 1, 0, 1, 0, 1, 99])).toStrictEqual(99)
    expect(solution([2, 2, 2, 3, 4, 4, 4, 5, 5, 5])).toStrictEqual(3)
  })
})
