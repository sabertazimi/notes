---
sidebar_position: 4
tags: [CS, Algorithm, String]
---

# String

## Manipulation

```cpp
sstream::stringstream

sort()
transform(toUpper/toLower)

string::size_type
string::npos(vector.end())

str.find() == string::npos/string::size_type
str.substr(int pos, int len)

getline(cin/sin, strbuf)
```

- string::size_type pre, post 指针: 进行逐行匹配

## KMP

在字符串 s 中寻找模式串 p,
不回溯 s 与 p 的字符指针 (暴力枚举法采取回溯指针法),
而是将 p 向右移动至**正确**的位置:

1. 求 `p[k]` 的前缀后缀最长公共元素长度:
   - `p = abab; maxLen[0] = 0, maxLen[1] = 0, maxLen[2] = 1, maxLen[3] = 2`.
   - `a` 没有公共前后缀, `ab` 没有公共前后缀, `aba` 有公共前后缀 `a`, `abab` 有公共前后缀 `ab`.
2. 根据 `maxLen[k]` 计算 `next[k]` (`next[0] = -1`):
   - `next[k]` 表示字符 `p[k]` 前的子串 `p[0, k-1]` 的前缀后缀最长公共元素长度.
   - `next` 数组相当于 `maxLen` 数组整体向右移动一位, 并且 `next[0] = -1`.
   - `next` 数组本质上记录着有限状态机的状态转移 (编译器的词法分析算法与语法分析算法也用到有限状态机).
3. 最后得到, 字符串 p 向右移动位数为 `k - next[k]`, k 为 `s[k] !== p[k]` 匹配失败时的下标.

```ts
function getNext(p: string): number[] {
  // next[0] = -1
  const next: number[] = [-1]

  // maxLen = next[0] = -1
  for (let i = 0, maxLen = -1; i < p.length - 1;) {
    if (maxLen === -1 || p[i] === p[maxLen]) {
      // p[i] === p[maxLen] => next[i + 1] = next[i] + 1 = maxLen + 1.
      i++
      maxLen++
      next[i] = maxLen
    } else {
      // Back to find shorter common prefix and suffix.
      maxLen = next[maxLen]
    }
  }

  return next
}

console.log(getNext('abcdabc'))
// [-1, 0, 0, 0, 0, 1, 2]
```

```ts
// 改进版
function getNext(p: string): number[] {
  // next[0] = -1
  const next: number[] = [-1]

  // maxLen = next[0] = -1
  for (let i = 0, maxLen = -1; i < p.length - 1;) {
    if (maxLen === -1 || p[i] === p[maxLen]) {
      i++
      maxLen++
      // 改进
      if (p[i] !== p[maxLen])
        next[i] = maxLen
      else next[i] = next[maxLen]
    } else {
      // Back to find shorter common prefix and suffix.
      maxLen = next[maxLen]
    }
  }

  return next
}
```

```ts
function search(s: string, p: string): number {
  let i = 0
  let j = 0

  while (i < s.length && j < p.length) {
    if (j === -1 || s[i] === p[j]) {
      i++
      j++
    } else {
      j = next[j]
    }
  }

  if (j === p.length)
    return i - j
  else return -1
}
```

## Rotate

```cpp
#include <string>
#include <algorithm>

string left_rotate(string str, int offset) {
  int size = str.length();
  int n = offset % size;
  reverse(str.begin(), str.begin() + n);
  reverse(str.begin() + n, str.end());
  reverse(str.begin(), str.end());
  return str;
}
```

## Repeat

- Combine with `Rotate String` to get solutions.
- Find two same character as boundary.
- `(s + s).slice(1, -1).includes(s)`.

## Palindrome

- Reverse: `reverse === original`.
- Recursion: `s[0] === s[length - 1] && isPalindrome(s.slice(1, length - 1))`
- Two pointers: `s[i] !== s[j]; i++, j--;`.
- Dynamic programming: `s[i] === s[j] && dp[i+1][j-1]`.
