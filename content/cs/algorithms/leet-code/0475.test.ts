import solution from './0475'

/**
 * @author sabertazimi
 * @license MIT
 * @level medium
 * @description heaters
 * @see {@link https://leetcode-cn.com/problems/heaters/}
 * Winter is coming! During the contest,
 * your first job is to design a standard heater
 * with a fixed warm radius to warm all the houses.
 * Every house can be warmed,
 * as long as the house is within the heater's warm radius range.
 * Given the positions of houses and heaters on a horizontal line,
 * return the minimum radius standard of heaters so that those heaters could cover all houses.
 * Notice that all the heaters follow your radius standard, and the warm radius will the same.
 */
describe('leetCode [0475]', () => {
  it('should AC', () => {
    expect(solution([1, 5], [2])).toStrictEqual(3)
    expect(solution([1, 2, 3], [2])).toStrictEqual(1)
    expect(solution([1, 2, 3, 4], [1, 4])).toStrictEqual(1)
  })
})
