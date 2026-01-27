---
sidebar_position: 20
tags: [CS, Algorithm, Search]
---

# Search

## First

- DFS (深度优先)：栈实现
- BFS (广度优先)：队列实现

![Search Algorithms Performance](./figures/search/search-performance.jpg 'Search Algorithms Performance')

## Cycle Detection

- 许多图论算法不适用于存在环路的复杂图,故使用循环检测剔除意外情况

处理方法：可将环路元素(如强联通分支)视作单一元素，忽视其内部结构

```java
a = b+1;b = c+1;c = a+1;
//a extends b;b extends c;c extends a;
```

## Sorted Array

### Binary

- Binary Search
- Divide and Conquer

> LeetCode 74/240

```ts
let lo = 0
let hi = nums.length - 1

while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1)
  if (nums[mid] === target)
    return nums[mid]
  else if (nums[mid] < target)
    lo = mid + 1
  else hi = mid - 1
}
```

## Max Min

```ts
Math.min(...nums)
Math.max(...nums)
```

在某些问题中, 要求满足条件的 max/min, 且可以轻易地判定某个值是否满足该条件, 则可利用二分法进行值的枚举

```cpp
// poj 1064
int N, K;
double L[max_n];

// judgement
bool C(double x) {
  int num = 0;

  for (int i = 0; i < N; i++) {
    num += (int)(L[i] / x);
  }

  return num >= K;
}

void solve(void) {
  double lb = 0, ub = numeric_limits<double>::max();

  for (int i = 0; i < 100; i++) {
    double mid = (lb + ub) / 2;
    if (C(mid)) lb = mid;
    else ub = mid;
  }

  printf("%.2f\n", floor(ub * 100) / 100);
}
```

## Range Max Min

- Segment Tree (线段树)
- Binary Indexed Tree (树状数组)
- Bucket Method (Divide and Conquer)

```cpp
const int maxN = 1 << 17;

int n;
int dat[2 * maxN - 1];

void init(int n_) {
  n = 1;

  // padding to 2^n
  while (n < n_) n *= 2;

  for (int i = 0; i < 2 * n - 1; i++) {
    dat[i] = (numeric_limits<int>::max)();
  }
}

void update(int k, int a) {
  k += n - 1;
  dat[k] = a;

  while (k > 0) {
    k = (k - 1) / 2;
    dat[k] = min(dat[k * 2 + 1], dat[k * 2 + 2]);
  }
}

int query(int a, int b, int k, int l, int r) {
  // failed
  if (r <= a || b <= l) {
    return (numeric_limits<int>::max)();
  }

  // [l, r) <= [a, b)
  if (a <= l && r <= b) {
    return dat[k];
  } else {
    int vl = query(a, b, k * 2 + 1, l, (l + r) / 2);
    int vr = query(a, b, k * 2 + 2, (l + r) / 2, r);
    return min(vl, vr);
  }
}
```
