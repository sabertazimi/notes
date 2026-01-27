import solution from './0401'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description binary-watch
 * @see {@link https://leetcode-cn.com/problems/binary-watch/}
 * binary watch has 4 LED on the top which represent the hours (0-11),
 * and the 6 LED on the bottom represent the minutes (0-59). Each LED represents a zero or one,
 * with the least significant bit on the right.
 */
describe('leetCode [0401]', () => {
  it('should AC', () => {
    expect(solution(0)).toStrictEqual(['0:00'])
    expect(solution(9)).toStrictEqual([])
    expect(solution(1)).toStrictEqual([
      '0:01',
      '0:02',
      '0:04',
      '0:08',
      '0:16',
      '0:32',
      '1:00',
      '2:00',
      '4:00',
      '8:00',
    ])
  })
})
