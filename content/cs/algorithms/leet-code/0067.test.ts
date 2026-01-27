import solution from './0067'

/**
 * @author sabertazimi
 * @license MIT
 * @level easy
 * @description add-binary
 * @see {@link https://leetcode-cn.com/problems/add-binary/}
 * Given two binary strings a and b,
 * return their sum as a binary string.
 */
describe('leetCode [0067]', () => {
  it('should AC', () => {
    expect(solution('11', '1')).toStrictEqual('100')
    expect(solution('1010', '1011')).toStrictEqual('10101')
    expect(
      solution(
        '10100000100100110110010000010101111011011001101110111111111101000000101111001110001111100001101',
        '110101001011101110001111100110001010100001101011101010000011011011001011101111001100000011011110011',
      ),
    ).toStrictEqual(
      '110111101100010011000101110110100000011101000101011001000011011000001100011110011010010011000000000',
    )
  })
})
