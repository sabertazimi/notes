import solution from './0217'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description contains-duplicate
 * @see {@link https://leetcode-cn.com/problems/contains-duplicate/}
 * Given an integer array nums,
 * return true if any value appears at least twice in the array,
 * and return false if every element is distinct.
 */
describe('leetCode [0217]', () => {
  it('should AC', () => {
    expect(solution([1])).toStrictEqual(false)
    expect(solution([1, 2, 3, 1])).toStrictEqual(true)
    expect(solution([1, 2, 3, 4])).toStrictEqual(false)
    expect(solution([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toStrictEqual(true)
  })
})
