---
sidebar_position: 2
tags: [AI, ML, RL, Bellman]
---

# Bellman Equation

## State Value

- 状态值函数的定义

$$v_\pi(s) = \mathbb{E}[G_t | s_t = s]$$

- 状态值函数的含义: 在策略 $\pi$ 下从状态 $s$ 出发的期望回报

## Bellman Equation for State Values

- 贝尔曼公式的推导 (基于全期望公式 / Law of Total Expectation)

$$v_\pi(s) = \sum_a \pi(a|s) \sum_{s'} p(s'|s, a) [r(s, a, s') + \gamma v_\pi(s')]$$

- 直观理解: 即时奖励 + 折扣后的未来状态值

## Matrix-Vector Form

- 将贝尔曼公式写成矩阵形式

$$\boldsymbol{v}_\pi = \boldsymbol{r}_\pi + \gamma \boldsymbol{P}_\pi \boldsymbol{v}_\pi$$

- 其中 $\boldsymbol{P}_\pi$ 为策略 $\pi$ 下的状态转移矩阵
- 解的存在性和唯一性

$$(\boldsymbol{I} - \gamma \boldsymbol{P}_\pi) \boldsymbol{v}_\pi = \boldsymbol{r}_\pi$$

$$\boldsymbol{v}_\pi = (\boldsymbol{I} - \gamma \boldsymbol{P}_\pi)^{-1} \boldsymbol{r}_\pi$$

## Action Value

- 动作值函数 (Q-function) 的定义

$$q_\pi(s, a) = \mathbb{E}[G_t | s_t = s, a_t = a]$$

- 动作值与状态值的关系

$$v_\pi(s) = \sum_a \pi(a|s) q_\pi(s, a)$$

## Bellman Equation for Action Values

$$q_\pi(s, a) = \sum_{s'} p(s'|s, a) [r(s, a, s') + \gamma \sum_{a'} \pi(a'|s') q_\pi(s', a')]$$

## Grid World Example

- 计算给定策略下的状态值
- 贝尔曼公式的数值求解
