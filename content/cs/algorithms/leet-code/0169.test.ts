import solution from './0169'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description majority-element
 * @see {@link https://leetcode-cn.com/problems/majority-element/}
 * Given an array nums of size n, return the majority element.
 * The majority element is the element that appears more than ⌊n / 2⌋ times.
 * You may assume that the majority element always exists in the array.
 */
describe('leetCode [0169]', () => {
  it('should AC', () => {
    expect(solution([3, 2, 3])).toStrictEqual(3)
    expect(solution([2, 2, 1, 1, 1, 2, 2])).toStrictEqual(2)
  })
})
