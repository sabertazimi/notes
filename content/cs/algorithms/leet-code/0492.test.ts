import solution from './0492'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description construct-the-rectangle
 * @see {@link https://leetcode-cn.com/problems/construct-the-rectangle/}
 * A web developer needs to know how to design a web page's size.
 * So, given a specific rectangular web page’s area,
 * your job by now is to design a rectangular web page,
 * whose length L and width W satisfy the following requirements:
 * The area of the rectangular web page you designed must equal to the given target area.
 * The width W should not be larger than the length L, which means L >= W.
 * The difference between length L and width W should be as small as possible.
 * Return an array [L, W] where L and W
 * are the length and width of the web page you designed in sequence.
 */
describe('leetCode [0492]', () => {
  it('should AC', () => {
    expect(solution(4)).toStrictEqual([2, 2])
    expect(solution(37)).toStrictEqual([37, 1])
    expect(solution(122122)).toStrictEqual([427, 286])
  })
})
