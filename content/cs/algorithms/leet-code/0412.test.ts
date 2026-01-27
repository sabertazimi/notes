import solution from './0412'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description fizz-buzz
 * @see {@link https://leetcode-cn.com/problems/fizz-buzz/}
 * Given an integer n, return a string array answer (1-indexed) where:
 * answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
 * answer[i] == "Fizz" if i is divisible by 3.
 * answer[i] == "Buzz" if i is divisible by 5.
 * answer[i] == i if non of the above conditions are true.
 */
describe('leetCode [0412]', () => {
  it('should AC', () => {
    expect(solution(3)).toStrictEqual(['1', '2', 'Fizz'])
    expect(solution(5)).toStrictEqual(['1', '2', 'Fizz', '4', 'Buzz'])
    expect(solution(15)).toStrictEqual([
      '1',
      '2',
      'Fizz',
      '4',
      'Buzz',
      'Fizz',
      '7',
      '8',
      'Fizz',
      'Buzz',
      '11',
      'Fizz',
      '13',
      '14',
      'FizzBuzz',
    ])
  })
})
