import { MAX_INT, MIN_INT } from './utils'

export default function reverse(x: number): number {
  const ret
    = x < 0
      ? Number.parseInt(
          `-${x.toString().slice(1).split('').reverse().join('')}`,
        )
      : Number.parseInt(x.toString().split('').reverse().join(''))

  if (ret > MAX_INT || ret < MIN_INT)
    return 0

  return ret
}
