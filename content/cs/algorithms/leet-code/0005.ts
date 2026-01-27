export default function longestPalindrome(s: string): string {
  const n = s.length
  let longestBegin = 0
  let maxLen = 1
  const dp = Array.from(Array.from({ length: 1000 }), () => Array.from<boolean>({ length: 1000 }).fill(false))

  // Single character is palindrome
  for (let i = 0; i < n; i++)
    dp[i][i] = true

  // Two repeat characters is palindrome
  for (let i = 0; i < n - 1; i++) {
    if (s.charAt(i) === s.charAt(i + 1)) {
      dp[i][i + 1] = true
      longestBegin = i
      maxLen = 2
    }
  }

  // Calculate isPalindrome(i, j)
  // Length of palindrome start from `3` to `n`
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i < n - len + 1; i++) {
      const j = i + len - 1

      if (s.charAt(i) === s.charAt(j) && dp[i + 1][j - 1]) {
        dp[i][j] = true
        longestBegin = i
        maxLen = len
      }
    }
  }

  return s.slice(longestBegin, longestBegin + maxLen)
}
