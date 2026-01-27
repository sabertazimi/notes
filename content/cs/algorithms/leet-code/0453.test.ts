import solution from './0453'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description minimum-moves-to-equal-array-elements
 * @see {@link https://leetcode-cn.com/problems/minimum-moves-to-equal-array-elements/}
 * Given an integer array nums of size n,
 * return the minimum number of moves required to make all array elements equal.
 * In one move, you can increment n - 1 elements of the array by 1.
 */
describe('leetCode [0453]', () => {
  it('should AC', () => {
    expect(solution([1, 1, 1])).toStrictEqual(0)
    expect(solution([1, 2, 3])).toStrictEqual(3)
  })
})
