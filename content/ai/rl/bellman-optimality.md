---
sidebar_position: 3
tags: [AI, ML, RL, Bellman, Optimal]
---

# Bellman Optimality Equation

## Optimal Policy

- 最优策略的定义: $v_{\pi^*}(s) \geq v_\pi(s), \forall s \in \mathcal{S}, \forall \pi$
- 最优策略的存在性
- 最优策略不一定唯一, 但最优值函数唯一

## Optimal State Value Function

$$
v^*(s) = \max_\pi v_\pi(s)
$$

## Optimal Action Value Function

$$
q^*(s, a) = \max_\pi q_\pi(s, a)
$$

- 最优状态值与最优动作值的关系

$$
v^*(s) = \max_a q^*(s, a)
$$

## Bellman Optimality Equation (BOE) for State Values

$$
v^*(s) = \max_a \sum_{s'} p(s'|s, a) [r(s, a, s') + \gamma v^*(s')]
$$

- 与贝尔曼期望公式的区别: $\max$ 替代 $\sum \pi(a|s)$
- BOE 是非线性公式, 没有闭式解

## Bellman Optimality Equation for Action Values

$$
q^*(s, a) = \sum_{s'} p(s'|s, a) [r(s, a, s') + \gamma \max_{a'} q^*(s', a')]
$$

## Interesting Properties

- 最优策略的贪婪性质
- 贝尔曼最优公式的不动点性质
- 最优策略可以取为确定性策略
