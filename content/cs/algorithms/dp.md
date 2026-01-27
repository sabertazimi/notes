---
sidebar_position: 22
tags: [CS, Algorithm, DP]
---

# Dynamic Programming

- 最优解结构特征: 一个选择 + 子问题的最优解 - 所有(可**重复求解**)子问题的最优解可**独立求解**(不互相影响)
- 递归定义最优解: 列出递归表达式
- 自底向上求解最优解
- 构造最优解(额外信息数组)

## Subproblems

- 子问题可映射为有向图, 并对其进行拓扑排序: 共有 O(n) 个子问题,
  每个子问题最多 O(n) 种选择, 则算法时间复杂度为 O(n^2).其对应子问题图有 n 个顶点, 每个顶点最多有 n-1 条边.
- 递归生成可以重复求解的子问题,而不是不断生成新的子问题

## Problems

- 切割钢条问题: `max{p[i], r[n-i]}`
- 矩阵相乘链问题
- 最大公共子序列问题: `r[i, j]` = `max{r[i, j-1], r[i-1, j]}`
- 无权最短路径: `path[i, j]` = `min{path[i, r], [r, j]}`

## Optimization

dp 数组可以滚动使用, 从而节省空间:

> `dp[m][n]` => `dp[2][n]` (`dp[i & 1][j]`).

关键: 最优子结构 + 状态无后效性

- 所有背包问题
- 二分问题:最优二分搜索树/文件合并
- 非连续特征序列: 最长子序列/最长上升序列
- 多重部分和问题 e.g. 数组中是否存在一对数的和为 xx
- 计数问题/分组问题/分划问题

## Digital Bits

数位 DP:

- 给定区间 [a, b], 求满足特定要求的数, 要求一般与大小无关, 与数位的组成相关
- 规模巨大, 无法枚举

> 递增数: 1234, 2579; 双峰数: 19280, 26193; 含 49: 49, 149, 1492; 整除 13: 26, 39 ...

`f(a, b) = f(b, 0) - f(a - 1, 0)`.

暴力 + 存储 = 记忆化搜索:

- 暴力枚举每一位的 `(0, ...,9)`.
- 利用 `dp[pos][state]` 与 `dfs(pos, state, k, flag)` 进行存储.

```cpp
/// \brief 数字处理函数
/// \param num 原始数据
/// \param digit 保存每个数位的值
/// \param state 初始状态
int f(int num){
    int ans;
    int pos = 0;

    while(num){
        digit[++pos]=num%10;
        num=num/10;
    }

    return dfs( pos, state , true);
}

/// \brief dfs 函数, 从高位开始遍历
/// \param f     记忆化数组
/// \param pos   当前数位下标
/// \param state 之前数字的状态
/// \param flag  上限标志
int dfs(int pos, int state, bool flag) {
    if (pos == -1) {
        return state == target_state;
    }
    if (!exception && ~f[pos][state]) {
        return f[pos][state];
    }

    int ans = 0;

    // 对于每一个数位, 求出枚举界限
    // 一般从 0 枚举至 9, 当到达特殊位置时, 枚举上限可能改变
    int next = exception ? digit[i] : 9;

    for (int digit = 0; digit <= next; digit++) {
        ans += dfs(pos - 1, new_state(state, digit), exception && digit == next);
    }

    return flag ? ans : f[pos][state] = ans;
}
```

```cpp
typedef long long ll;

int a[20];

ll dp[20][state];   //不同题目状态不同

ll dfs(int pos, int state, bool lead, bool limit) {
    // 递归边界, 按位枚举最低位是0, pos == -1 表示枚举结束
    if (pos == -1) {
        // 若可以保证每一位都合法, 则 return 1; 否则 return 0
        return 1;
    }

    // 记忆化
    if (!limit && !lead && dp[pos][state] != -1) {
        return dp[pos][state];
    }

    // 根据 limit 判断枚举的上界 up
    int up = limit ? a[pos] : 9;

    // 开始计数
    ll ans=0;

    // 枚举: 把不同情况的个数加到ans
    for(int i = 0;i <= up; i++)
    {
        // 当前数位枚举的数是i，根据题目的约束条件分类讨论
        // 计算不同情况下的个数, 根据 state 变量来保证 i 的合法性
        // 一定要保证枚举数的合法性

        // 比如要求数位上不能有 62 连续出现, 那么state 就要保存前一位 pre
        // 前一位如果是 6 那么位不能是 2

        // 当不合法时, 直接 continue
        if() ...
        else if()...

        ans += dfs(pos-1, new_state(pos, state) /*状态转移*/,
          lead && i==0, limit && i == a[pos])
    }

    // 计算结束, 记录状态
    if (!limit && !lead) {
        dp[pos][state] = ans;
    }

    return ans;
}

ll solve(ll x) {
    int pos=0;

    // 数位分解
    while(x) {
        a[pos++] = x % 10;
        x /= 10;
    }

    // 从最高位开始枚举
    // 最高位前导为 0, 且受上限限制(无法枚举至 9)
    return dfs(pos-1, state /*一系列状态 */, true, true);
}

int main(void) {
    ll le,ri;

    while (~scanf("%lld %lld", &le, &ri)) {
        // 初始化dp数组为-1
        printf("%lld\n", solve(ri)-solve(le-1));
    }

    return 0;
}
```
