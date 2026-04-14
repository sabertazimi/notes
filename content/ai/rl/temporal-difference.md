---
sidebar_position: 12
tags: [AI, ML, RL, TD, Q-Learning]
---

# Temporal-Difference

## Motivating Example

- TD 方法的基本思想: bootstrapping (自举)
- TD vs. MC 的核心区别: TD 使用估计值更新, MC 使用实际回报

## TD Algorithm: Introduction

- TD(0) 更新规则

$$V(s_t) \leftarrow V(s_t) + \alpha [r_{t+1} + \gamma V(s_{t+1}) - V(s_t)]$$

- TD 误差 (TD error): $\delta_t = r_{t+1} + \gamma V(s_{t+1}) - V(s_t)$
- TD 与 RM 算法的关系

## TD Algorithm: Convergence

- TD 算法的收敛性分析
- 基于随机逼近理论
- TD 的期望更新等价于贝尔曼期望方程

## Sarsa (On-Policy TD Control)

- Sarsa 更新规则

$$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha [r_{t+1} + \gamma Q(s_{t+1}, a_{t+1}) - Q(s_t, a_t)]$$

- Sarsa: State-Action-Reward-State-Action
- 在线策略控制: 行为策略 = 目标策略
- 与 $\epsilon$-贪心策略结合

## Expected Sarsa

$$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha [r_{t+1} + \gamma \sum_{a'} \pi(a'|s_{t+1}) Q(s_{t+1}, a') - Q(s_t, a_t)]$$

- 降低 Sarsa 的方差
- 可以使用任意策略进行探索

## $n$-Step TD

- $n$-步回报 (n-step return)

$$G_{t:t+n} = r_{t+1} + \gamma r_{t+2} + \cdots + \gamma^{n-1} r_{t+n} + \gamma^n V(s_{t+n})$$

- $n$-步 TD 更新
- $n$-步 Sarsa

## Q-Learning (Off-Policy TD Control)

- Q-learning 更新规则

$$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha [r_{t+1} + \gamma \max_{a'} Q(s_{t+1}, a') - Q(s_t, a_t)]$$

- 离线策略控制: 行为策略 $\neq$ 目标策略
- Q-learning 的收敛性保证

## Unified Viewpoint and Summary

- MC 和 TD 的统一视角
- 多步 TD 方法的谱系
- $\lambda$-return 和 TD($\lambda$) 的简介
