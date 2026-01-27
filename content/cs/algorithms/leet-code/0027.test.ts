import solution from './0027'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description remove-element
 * @see {@link https://leetcode-cn.com/problems/remove-element/}
 * Given an integer array nums and an integer val,
 * remove all occurrences of val in nums in-place.
 * The relative order of the elements may be changed.
 * Since it is impossible to change the length of the array in some languages,
 * you must instead have the result be placed in the first part of the array nums.
 * More formally, if there are k elements after removing the duplicates,
 * then the first k elements of nums should hold the final result.
 * It does not matter what you leave beyond the first k elements.
 * Return k after placing the final result in the first k slots of nums.
 * Do not allocate extra space for another array.
 * You must do this by modifying the input array in-place with O(1) extra memory.
 */
describe('leetCode [0027]', () => {
  it('should AC', () => {
    expect(solution([3, 2, 2, 3], 3)).toStrictEqual(2)
    expect(solution([0, 1, 2, 2, 3, 0, 4, 2], 2)).toStrictEqual(5)
  })
})
