---
sidebar_position: 1
tags: [AI, ML, RL, MDP]
---

# Markov Decision Process

智能体 (Agent) 与环境 (Environment) 的交互模型:

- 状态 (State) $s \in \mathcal{S}$
- 动作 (Action) $a \in \mathcal{A}$
- 策略 (Policy) $\pi(a|s)$

## State

### Space

状态空间:

$$
\mathcal{S} = \{s_i\}_{i=1}^n
$$

### Transition

状态转移概率:

$$
P(s'|s, a)
$$

## Action

动作空间:

$$
\mathcal{A}(s_i) = \{a_i\}_{i=1}^n
$$

## Policy

$\pi: \mathcal{S} \to \Delta(\mathcal{A})$:

- 确定性策略: $\pi(s) = a$
- 随机策略: $\pi(a|s) = P(a_t = a | s_t = s)$

## Reward

### Signal

奖励信号:

$$
r_t = \mathcal{R}(s_t, a_t, s_{t+1})
$$

### Probability

奖励概率:

$$
P(r|s, a)
$$

## Trajectory

A state-action-reward chain:

$$
s_1 \xrightarrow[r=0]{a_2} s_2 \xrightarrow[r=0]{a_3} s_5 \xrightarrow[r=0]{a_3} s_8 \xrightarrow[r=1]{a_2} s_9
$$

## Return

Cumulative reward of trajectory:

- 无折扣回报 (Undiscounted Return): $G_t = \sum\limits_{k=0}^{\infty} r_{t+k+1}$
- 折扣回报 (Discounted Return): $G_t = \sum\limits_{k=0}^{\infty} \gamma^k r_{t+k+1}$

:::[Discount Rate]

$\gamma \in [0, 1)$:

- $\gamma \to 0$: 重视即时奖励
- $\gamma \to 1$: 重视长期回报

:::

## `MDP`

### Definition

五元组定义 $(\mathcal{S}, \mathcal{A}, P, \mathcal{R}, \gamma)$

### Property

马尔可夫性质:

$$
p(s_{t+1}|s_t, a_t, s_{t-1}, a_{t-1}, \dots, s_0, a_0) = p(s_{t+1}|s_t, a_t)
$$

$$
p(r_{t+1}|s_t, a_t, s_{t-1}, a_{t-1}, \dots, s_0, a_0) = p(r_{t+1}|s_t, a_t)
$$

### Distribution

轨迹的概率分布:

$$
P(\tau|\pi) = p(s_1) \prod_{t=1}^{T} \pi(a_t|s_t) p(s_{t+1}|s_t, a_t)
$$
