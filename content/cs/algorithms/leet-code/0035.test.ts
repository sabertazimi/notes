import solution from './0035'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description search-insert-position
 * @see {@link https://leetcode-cn.com/problems/search-insert-position/}
 * Given a sorted array of distinct integers and a target value,
 * return the index if the target is found.
 * If not, return the index where it would be if it were inserted in order.
 * You must write an algorithm with O(log n) runtime complexity.
 */
describe('leetCode [0035]', () => {
  it('should AC', () => {
    expect(solution([1], 0)).toStrictEqual(0)
    expect(solution([1], 1)).toStrictEqual(0)
    expect(solution([1], 2)).toStrictEqual(1)
    expect(solution([1, 3, 5, 6], 0)).toStrictEqual(0)
    expect(solution([1, 3, 5, 6], 2)).toStrictEqual(1)
    expect(solution([1, 3, 5, 6], 5)).toStrictEqual(2)
    expect(solution([1, 3, 5, 6], 7)).toStrictEqual(4)
  })
})
