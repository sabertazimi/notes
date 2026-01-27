import solution from './0202'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description happy-number
 * @see {@link https://leetcode-cn.com/problems/happy-number/}
 * Write an algorithm to determine if a number n is happy.
 * A happy number is a number defined by the following process:
 * Starting with any positive integer, replace the number by the sum of the squares of its digits.
 * Repeat the process until the number equals 1 (where it will stay),
 * or it loops endlessly in a cycle which does not include 1.
 * Those numbers for which this process ends in 1 are happy.
 */
describe('leetCode [0202]', () => {
  it('should AC', () => {
    expect(solution(1)).toStrictEqual(true)
    expect(solution(2)).toStrictEqual(false)
    expect(solution(19)).toStrictEqual(true)
  })
})
