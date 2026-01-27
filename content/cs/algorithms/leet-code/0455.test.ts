import solution from './0455'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description assign-cookies
 * @see {@link https://leetcode-cn.com/problems/assign-cookies/}
 * Assume you are an awesome parent and want to give your children some cookies.
 * But, you should give each child at most one cookie.
 * Each child i has a greed factor g[i],
 * which is the minimum size of a cookie that the child will be content with;
 * and each cookie j has a size s[j].
 * If s[j] >= g[i], we can assign the cookie j to the child i,
 * and the child i will be content.
 * Your goal is to maximize the number of your content children and output the maximum number.
 */
describe('leetCode [0455]', () => {
  it('should AC', () => {
    expect(solution([1, 2, 3], [1, 1])).toStrictEqual(1)
    expect(solution([1, 2], [1, 2, 3])).toStrictEqual(2)
  })
})
