---
sidebar_position: 4
tags: [AI, ML, RL, DP, Iteration]
---

# Iteration

| 方法         | 策略评估   | 策略改进 | 特点         |
| ------------ | ---------- | -------- | ------------ |
| 值迭代       | 单步更新   | 隐式改进 | 计算效率高   |
| 策略迭代     | 精确求解   | 贪婪改进 | 每轮改进保证 |
| 截断策略迭代 | 有限步迭代 | 贪婪改进 | 灵活平衡     |

## Value

$k*1$ 次迭代:

1. Policy update ($1$): $\pi_{k + 1} = \arg\underset{\pi}{\max}(r_\pi + \gamma P_\pi v_k)$
2. Value update: $v_{k + 1} = r_{\pi_{k + 1}} + \gamma P_{\pi_{k + 1}} v_k$

## Policy

$k*\infty$ 次迭代:

1. Policy evaluation ($\infty$): $v_{\pi_k}^{(j+1)} = r_{\pi_k} + \gamma P_{\pi_k} v_{\pi_k}^{(j)}, j = 0, 1, 2, \dots$
2. Policy improvement: $\pi_{k + 1} = \arg\underset{\pi}{\max}(r_\pi + \gamma P_\pi v_{\pi_k})$

## Truncated Policy

广义策略迭代 (Generalized Policy Iteration):

- 不求精确解, 只迭代有限 $j$ 步
- 值迭代和策略迭代是特例

![Iteration](./figures/iteration.webp 'Iteration')
