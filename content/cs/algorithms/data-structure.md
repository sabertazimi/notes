---
sidebar_position: 1
tags: [CS, Algorithm, DataStructure]
---

# Data Structure

## Array

可以利用数组元素的正负性表示存在性 (或其他特殊意义).

### Two Pointers

- 可以在**有穷时间内**判断是否存在**循环**: 一个快指针, 一个慢指针, 当两者相遇时, 表示存在循环.
- Slide Window: `window = [lo, hi]`.

### Float Pointer

利用浮动指针解决相关问题:

- 字符串比较
- 连续区间问题(尺取法)

## List

Slow and fast pointer:

- Judge cycle.
- Find middle node.

## Stack

### 单调栈

寻找下一个更小/更大 (Smaller/Greater) 元素.

```ts
const stack: number[] = []
const greaterMap = new Map<number, number>()

for (const num of nums) {
  while (stack.length && stack[stack.length - 1] < num)
    greaterMap.set(stack.pop() as number, num)

  stack.push(num)
}
```

## Map

- 用于 Hash 化
- 用于将字符串转为数字
- 用于计数

## Set

- 用于去重与查重 (`Duplicate Problem`, e.g. LeetCode 217/219/220).
- 用于集合运算题（交、并、差等）

## BitMap

Bit presentation: 多用于状态枚举(1 bit 表示 1 个状态/开关), 表示状态集合.

> 可用于动态规划中压缩状态

```cpp
0 // empty set
1 << i // just 1 bit on
(1 << n) - 1 // n bit on
if (S >> i & 1) // include nth(i) bit
S | 1 << i // insert nth(i) bit
S & ~(1 << i) // remove nth(1) bit
S | T // union
S & T // intersection

i & -i // last 1 bit
```
