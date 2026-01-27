function isSubsequence(first: string, second: string, m: number, n: number): boolean {
  if (n === 0)
    return true
  if (m === 0)
    return false
  if (first[m - 1] === second[n - 1])
    return isSubsequence(first, second, m - 1, n - 1)
  return isSubsequence(first, second, m - 1, n)
}

export default function findLongestUncommonSubsequenceLength(
  strings: string[],
): number {
  let max = -1

  strings.sort((a, b) => a.length - b.length)

  for (let i = 0; i < strings.length; i++) {
    let uniq = true

    for (let j = 0; j < strings.length; j++) {
      if (
        i !== j
        && (strings[i] === strings[j]
          || isSubsequence(
            strings[j],
            strings[i],
            strings[j].length,
            strings[i].length,
          ))
      ) {
        uniq = false
        break
      }
    }

    if (uniq)
      max = Math.max(max, strings[i].length)
  }

  return max
}
