---
sidebar_position: 4
tags: [AI, ML, RL, DP, Iteration]
---

# Iteration

## Value Iteration

- 核心思想: 直接应用贝尔曼最优算子

$$
v_{k+1}(s) = \max_a \sum_{s'} p(s'|s, a) [r(s, a, s') + \gamma v_k(s')]
$$

- 值迭代的收敛性: $\lim_{k \to \infty} v_k = v^*$
- 收敛速度分析: 误差界 $||v_k - v^*|| \leq \frac{\gamma^k}{1-\gamma} ||v_1 - v_0||$
- 算法伪代码

## Policy Iteration

- 两步交替过程
  1. 策略评估 (Policy Evaluation): 给定策略, 求解 $v_\pi$
  2. 策略改进 (Policy Improvement): $\pi'(s) = \arg\max_a q_\pi(s, a)$
- 策略改进定理 (Policy Improvement Theorem)
- 策略迭代的有限步收敛性

## Truncated Policy Iteration

- 广义策略迭代 (Generalized Policy Iteration, GPI)
- 截断策略评估: 不求精确解, 只迭代有限步
- 值迭代和策略迭代都是截断策略迭代的特例

## Comparison

| 方法         | 策略评估   | 策略改进 | 特点         |
| ------------ | ---------- | -------- | ------------ |
| 策略迭代     | 精确求解   | 贪婪改进 | 每轮改进保证 |
| 值迭代       | 单步更新   | 隐式改进 | 计算效率高   |
| 截断策略迭代 | 有限步迭代 | 贪婪改进 | 灵活平衡     |
