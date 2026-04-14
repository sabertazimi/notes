---
sidebar_position: 1
tags: [AI, ML, RL, MDP]
---

# Markov Decision Process

## Agent and Environment

- 智能体 (Agent) 与环境 (Environment) 的交互模型
- 状态 (State) $s \in \mathcal{S}$
- 动作 (Action) $a \in \mathcal{A}$
- 策略 (Policy) $\pi(a|s)$

## State

- 状态空间的定义
- 状态转移 (State transition) $p(s'|s, a)$
- 马尔可夫性质 (Markov property): $p(s_{t+1}|s_t, a_t, s_{t-1}, a_{t-1}, \ldots) = p(s_{t+1}|s_t, a_t)$

## Action

- 离散动作空间 vs. 连续动作空间
- 确定性策略 vs. 随机策略

## Policy

- 策略的定义: $\pi: \mathcal{S} \to \Delta(\mathcal{A})$
- 确定性策略: $\pi(s) = a$
- 随机策略: $\pi(a|s) = P(a_t = a | s_t = s)$

## Reward

- 奖励信号 $r_t = R(s_t, a_t, s_{t+1})$
- 奖励函数的设计
- 即时奖励 vs. 长期回报

## Return (Cumulative Reward)

- 无折扣回报 (Undiscounted return): $G_t = \sum\limits_{k=0}^{\infty} r_{t+k+1}$
- 折扣回报 (Discounted return): $G_t = \sum\limits_{k=0}^{\infty} \gamma^k r_{t+k+1}$
- 折扣因子 $\gamma \in [0, 1)$ 的作用

## Markov Decision Process (MDP)

- MDP 的五元组定义 $(\mathcal{S}, \mathcal{A}, P, R, \gamma)$
- 状态转移概率 $P(s'|s, a)$
- 轨迹 (Trajectory/Episode) 的概率分布

$$P(\tau|\pi) = p(s_1) \prod_{t=1}^{T} \pi(a_t|s_t) p(s_{t+1}|s_t, a_t)$$

## Grid World Example

- 书中贯穿使用的网格世界示例
- 状态空间、动作空间、奖励函数的定义
