import solution from './0084'

/**
 * @author sabertazimi
 * @license MIT
 * @level hard
 * @description largest-rectangle-in-histogram
 * @see {@link https://leetcode-cn.com/problems/largest-rectangle-in-histogram/}
 * Given an array of integers heights representing the histogram's bar height where the width of each bar is 1,
 * return the area of the largest rectangle in the histogram.
 */
describe('leetCode [0084]', () => {
  it('should AC', () => {
    expect(solution([0])).toStrictEqual(0)
    expect(solution([2, 4])).toStrictEqual(4)
    expect(solution([2, 1, 5, 6, 2, 3])).toStrictEqual(10)
  })
})
