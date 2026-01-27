import { MAX_INT, MIN_INT } from './utils'

export default function myAtoi(s: string): number {
  const num = Number.parseInt(s, 10) || 0
  if (num > MAX_INT)
    return MAX_INT
  if (num < MIN_INT)
    return MIN_INT
  return num
}
