import solution from './0292'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description nim-game
 * @see {@link https://leetcode-cn.com/problems/nim-game/}
 * You are playing the following Nim Game with your friend:
 * Initially, there is a heap of stones on the table.
 * You and your friend will alternate taking turns, and you go first.
 * On each turn, the person whose turn it is will remove 1 to 3 stones from the heap.
 * The one who removes the last stone is the winner.
 * Given n, the number of stones in the heap,
 * return true if you can win the game assuming both you and your friend play optimally,
 * otherwise return false.
 */
describe('leetCode [0292]', () => {
  it('should AC', () => {
    expect(solution(1)).toStrictEqual(true)
    expect(solution(2)).toStrictEqual(true)
    expect(solution(4)).toStrictEqual(false)
  })
})
