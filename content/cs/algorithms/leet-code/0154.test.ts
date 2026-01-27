import solution from './0154'

/**
 * @author sabertazimi
 * @license MIT
 * @level hard
 * @description find-minimum-in-rotated-sorted-array-ii
 * @see {@link https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array-ii/}
 * Suppose an array of length n sorted in ascending order is rotated between 1 and n times.
 * For example, the array nums = [0,1,2,4,5,6,7] might become:
 * [4,5,6,7,0,1,2] if it was rotated 4 times.
 * [0,1,2,4,5,6,7] if it was rotated 7 times.
 * Notice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time
 * results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].
 * Given the sorted rotated array that may contain duplicates,
 * return the minimum element of this array.
 * You must write an algorithm that runs in O(log n) time.
 */
describe('leetCode [0153]', () => {
  it('should AC', () => {
    expect(solution([1])).toStrictEqual(1)
    expect(solution([2, 1])).toStrictEqual(1)
    expect(solution([2, 2])).toStrictEqual(2)
    expect(solution([1, 3, 5])).toStrictEqual(1)
    expect(solution([3, 4, 5, 1, 2])).toStrictEqual(1)
    expect(solution([2, 2, 2, 0, 1])).toStrictEqual(0)
    expect(solution([11, 13, 15, 17])).toStrictEqual(11)
    expect(solution([4, 5, 6, 6, 7, 7, 0, 1, 1, 2, 2])).toStrictEqual(0)
  })
})
